const nearley = require('nearley')
const grammar = require('./grammar/grammar')
const fs = require('fs')

const options = require('../argumentParser')

const handleErrors = require('./errorsHandler')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {keepHistory: true})

/**
 * Normalize a condition, for example by putting === instead of ==
 */
function normalizeCondition(expression) {
    expression = expression.replace(/==(?!=)/, "===")
    return expression
}

/**
 * Evaluates a javascript expression. Returns its result,
 * and modify the variables if needed.
 * @param expression the expression to evaluate
 * @param variables the current variables
 * @return {*} the result of the expression
 */
function evaluate(expression, variables) {
    return new Function(`return ${expression}`).call(variables)
}

/**
 * Parse a control block (if, while...)
 * @param block the control block
 * @param variables the variables of the current scope
 * @param depth depth of the current block
 * @depth the depth of the current block
 * @returns {string} the result of the parsing
 */
function parseBlock(block, variables, depth) {
    const conditionDisplay = `{% ${block.control.conditional} ${block.control.condition} %}`

    let result = ''
    let argument = normalizeCondition(block.control.condition)

    if (block.control.conditional === 'if') {
        if (evaluate(argument, variables)) {
            result = parseContent(block.content, variables, depth + 1)
        }
        return result
    }

    if (block.control.conditional === 'while') {
        let numberOfLoops = 0
        let warning = 10000

        while (evaluate(argument, variables)) {
            result += parseContent(block.content, variables, depth + 1)

            if (options.warnings) {
                numberOfLoops++
                if (numberOfLoops === warning) {
                    console.warn('[WARNING]', conditionDisplay, 'executed', warning, 'times - might be an infinite loop')
                    warning *= 10
                }
            }
        }
        return result
    }
}


function parseCommandArgs(commandArgs) {
    let result = ''
    for (const arg of commandArgs) {
        if (arg.type === 'literal') {
            result += arg.data
        }
        else {
            result += evaluate(arg.data)
        }
    }
    return result
}

/**
 * Parse the content of a block
 * @param blockContent the content of a block - a group of statements
 * @param variables the current variables
 * @param depth the depth of the current block content
 * @returns {string} the result of the parsing
 */
function parseContent(blockContent, variables, depth) {
    let result = ''
    for (const statement of blockContent) {
        const type = statement.type
        switch (type) {
            case 'block':
                result += parseBlock(statement, variables, depth)
                break
            case 'assignment':
                evaluate(`${statement.name}${statement.value}`, variables)
                break
            case 'command':
                result += `${statement.command} ${parseCommandArgs(statement.value)}\n`
                break
            case 'comment':
                result += statement.comment + '\n'
                break
            default:
                let error = `Incorrect statement type "${type}"\n`
                error += 'This case is not supposed to be possible. There is an error in the program itself.\n'
                error += 'Problematic statement:\n' + JSON.stringify(statement, null, 2)
                throw new Error(error)
        }
    }

    return result
}

/**
 * Parse a file and returns the result of the parse
 * @param fileName the name of the file to parse
 * @returns {string} the result of the parsing
 */
function parseFile(fileName) {
    const file = fs.readFileSync(fileName, 'utf8')

    try {
        parser.feed(file)
    }
    catch (error) {
        throw error
        //handleErrors(error, parser)
        //process.exit(1)
    }

    let results = parser.results

    if (options.debug) {
        console.log('RESULTS:')
        console.log(JSON.stringify(results, null, 2))

        for (let i = 1; i < results.length; i++) {
            if (JSON.stringify(results[i - 1]) === JSON.stringify(results[i])) {
                console.log('IDENTICAL')
            }
            else {
                console.log('DIFFERENT'.red)
            }
        }

        console.log('\n')
    }

    let result = results[0]
    return parseContent(result, {}, 0)
}

module.exports = parseFile