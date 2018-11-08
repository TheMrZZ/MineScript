const nearley = require('nearley')
const vm = require('vm')
const grammar = require('./grammar/grammar')

let options = {}

/**
 * @class ParsedContent
 * @property {string[]} function the content of the resulting function
 * @property {string[]} onLoad the content to add to the onLoad file
 * @property {int} repeat the number of ticks between each repetition
 */
class ParsedContent {
    /**
     * Create a {@link ParsedContent} object, with:
     * - onLoad set to []
     * - function set to []
     * - repeat set to 0
     */
    constructor() {
        this.onLoad = []
        this.function = []
        this.repeat = 0
    }

    /**
     * Add a parsed content to the current parsed content.
     * If a string is given, then it will trim it, then add it.
     * @param {ParsedContent|string} parsedContent the parsed content to add - or a string to add to the function file
     */
    add(parsedContent) {
        if (typeof parsedContent === 'string') {
            this.function.push(parsedContent.trim())
            return
        }
        this.function.concat(parsedContent.function)
        this.onLoad.concat(parsedContent.onLoad)
        this.repeat = parsedContent.repeat
    }
}

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
 * @param {string} expression the expression to evaluate
 * @param {object} variables the current variables
 * @param {int} line line of the current expression
 * @param {string=} currentExpression (optional) the full expression. Will not be evaluated, but is displayed on error.
 *                  Useful only a part of an expression is evaluated.
 * @return {*} the result of the expression
 */
function evaluate(expression, variables, line, currentExpression) {
    try {
        return vm.runInContext(expression, variables)
    }
    catch (e) {
        let expressionToDisplay = currentExpression === undefined ? expression : currentExpression
        let stack = e.stack.split('\n')
        let msg = `[${e.name}] ${e.message}\n`
        msg += stack[1] + '\n' + stack[2] + '\n'
        msg += `Erroneous expression [line ${line}]:\n${expressionToDisplay}\n`
        console.error(msg)
        throw e
    }
}

/**
 * Parse any block
 * @param block the control block
 * @param variables the variables of the current scope
 * @param depth depth of the current block
 * @depth the depth of the current block
 * @returns {ParsedContent} the result of the parsing
 */
function parseBlock(block, variables, depth) {
    const control = block.control
    const conditionDisplay = `{% ${control.conditional} ${control.condition} %}`

    let result = new ParsedContent()
    let argument = normalizeCondition(block.control.condition)

    if (control.conditional === 'if') {
        if (evaluate(argument, variables, control.line, conditionDisplay)) {
            result = parseContent(block.content, variables, depth + 1)
        }
        return result
    }

    if (control.conditional === 'while') {
        let numberOfLoops = 0
        let warning = 10000

        while (evaluate(argument, variables, control.line, conditionDisplay)) {
            result.add(parseContent(block.content, variables, depth + 1))

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

/**
 * Parse command args
 * @param commandArgs the arguments to parse
 * @param variables the current variables
 * @return {string} the result of the parsing
 */
function parseCommandArgs(commandArgs, variables) {
    if (!commandArgs) {
        return ''
    }

    let result = ''
    for (const arg of commandArgs) {
        if (arg.type === 'literal') {
            result += arg.data
        }
        else {
            result += evaluate(arg.data, variables, arg.line)
        }
    }
    return result
}

/**
 * Parse the content of a block
 * @param blockContent the content of a block - a group of statements
 * @param variables the current variables
 * @param depth the depth of the current block content
 * @returns {ParsedContent} the result of the parsing
 */
function parseContent(blockContent, variables, depth) {
    let result = new ParsedContent()

    for (const statement of blockContent) {
        const type = statement.type
        switch (type) {
            case 'block':
                result.add(parseBlock(statement, variables, depth))
                break
            case 'assignment':
                evaluate(`${statement.name} ${statement.value}`, variables, statement.line)
                break
            case 'command':
                result.add(`${statement.command} ${parseCommandArgs(statement.value, variables)}`)
                break
            case 'comment':
                break
            case 'initialExpression':
                result.add(evaluate(statement.expression, variables, statement.line) +
                           parseCommandArgs(statement.value, variables))
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
 * @param {string} string the string to parse
 * @param options_ the options of the parser
 * @returns {ParsedContent} the result of the parsing
 */
function parse(string, options_) {
    const reportMessage = 'You can report at https://github.com/TheMrZZ/MineScript/issues.\n' +
                          'Please include the file you parsed and this error message to your report.'

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {keepHistory: true})
    Object.assign(options, options_)

    try {
        parser.feed(string)
    }
    catch (error) {
        throw error
        //handleErrors(error, parser)
        //process.exit(1)
    }

    let results = parser.results
    if (results.length === 0) {
        throw new SyntaxError('Minescript compilation failed for an unknown reason.\n' +
                              'Check if every condition block {% if ... %}, {% while ... %}} ' +
                              'has a corresponding end block: {% endif %}, {% endwhile %}...\n' +
                              reportMessage)
    }


    if (results.length > 2) {
        /* This should NEVER happens in production.
         * If this happens, to avoid problems, if every
         * given result is the same, we display a warning,
         * but will take any result (since they're all the same)
         */
        let identical = true

        options.logDebug('RESULTS:')
        options.logDebug(JSON.stringify(results, null, 2))

        for (let i = 1; i < results.length; i++) {
            if (JSON.stringify(results[i - 1]) === JSON.stringify(results[i])) {
                options.logDebug(`Results ${i - 1} and ${i} are IDENTICAL`)
            }
            else {
                options.logDebug(`Results ${i - 1} and ${i} are DIFFERENT`)
                identical = false
            }
        }

        if (identical) {
            console.log("A minor bug happened - don't worry, it should not cause you any problem.")
            console.log('However, we would be glad if you could report the file you parsed along with this message.')
            console.log(reportMessage)
            if (options.debug) {
                throw new SyntaxError('Parser gave multiple identical results')
            }
        }
        else {
            throw new SyntaxError('Parser gave different possible results. ' +
                                  'This should not happen and is not your fault - its our.\n' +
                                  reportMessage)
        }
    }

    let result = results[0]

    // Following libraries are imported in order to be used within minescripts.
    let variables = {
        require: require,
        Vector: require('../vector'),
    }
    let context = vm.createContext(variables)
    let parsed = parseContent(result, context, 0)
    return parsed
}

module.exports = parse