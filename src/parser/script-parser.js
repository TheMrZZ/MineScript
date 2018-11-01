const nearley = require('nearley')
const grammar = require('./grammar/grammar')
const fs = require('fs')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

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
 * Parse a single Minecraft command
 * @param command_ the command to parse
 * @param variables the current variables
 * @returns {string} the result of the parsing
 */
function parseCommand(command_, variables) {
    const command = command_
    const args = command_.args


}

/**
 * Parse a control block (if, while...)
 * @param block the control block
 * @param variables the variables of the current scope
 * @returns {string} the result of the parsing
 */
function parseBlock(block, variables) {
    let result = ''
    let argument = normalizeCondition(block.controlArgument)
    if (block.controlType === 'if') {
        if (evaluate(argument, variables)) {
            result = parseContent(block.content)
        }
        return result
    }

    if (block.controlType === 'while') {
        while (evaluate(argument, variables)) {
            result += parseContent(block.content, variables)
        }
        return result
    }
}

/**
 * Parse the content of a block
 * @param blockContent the content of a block - a group of statements
 * @param variables the current variables
 * @returns {string} the result of the parsing
 */
function parseContent(blockContent, variables) {
    let result = ''
    for (const statement of blockContent) {
        const type = statement.type
        switch (type) {
            case 'block':
                result += parseBlock(statement, variables)
                break
            case 'assignment':
                evaluate(`${statement.name} = ${statement.value}`, variables)
                break
            case 'command':
                result += `${statement.command} ${statement.args}\n`
                break
            case 'comment':
                result += statement.comment + '\n'
                break
            default:
                let error = 'Incorrect statement type: ' + type + '\n'
                error += 'This case is not supposed to be possible. There is an error in the program itself.'
                error += 'Problematic statement: ' + JSON.stringify(statement, null, 2)
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
        test = parser.feed(file)
    }
    catch (e) {
        console.log('------------------')
        console.log(JSON.stringify(e, null, 2))
        console.log('------------------')
        console.log(JSON.stringify(grammar.ParserRules, null, 2))
        console.log('------------------')
        process.exit(1)
    }

    let results = parser.results
    console.log('Results:')
    console.log(JSON.stringify(results, null, 2))
    return parseContent(results, {})
}

module.exports = parseFile