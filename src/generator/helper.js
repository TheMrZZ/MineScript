/*
 * This file is a helper file.
 * It provides helper functions & classes.
 * It does NOT generate anything by itself.
 */

const vm = require('vm')

/**
 * @class GeneratedContent
 * @property {string[]} function the content of the resulting function
 * @property {string[]} onLoad the content to add to the onLoad file
 * @property {int} repeat the number of ticks between each repetition
 */
class GeneratedContent {
    /**
     * Create a {@link GeneratedContent} object, with:
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
     * Add some content to the current generated content.
     * If a string is given, then it will trim it, then add it.
     * @param {GeneratedContent|string} generatedContent the generated content to add - or a string to add to the function file
     */
    add(generatedContent) {
        if (typeof generatedContent === 'string') {
            this.function.push(generatedContent.trim())
            return
        }
        this.function = this.function.concat(generatedContent.function)
        this.onLoad = this.onLoad.concat(generatedContent.onLoad)
        this.repeat = generatedContent.repeat
    }
}

/**
 * Normalize a condition, for example by putting === instead of ==
 */
function normalizeCondition(expression) {
    if (expression) {
        expression = expression.replace(/==(?!=)/, "===")
    }
    return expression
}

/**
 * Evaluates a javascript expression. Returns its result,
 * and modify the variables if needed.
 * @param {string} expression the expression to evaluate
 * @param {object} variables the current variables
 * @param {int} line line of the current expression
 * @param {string=} currentExpression the full expression. Will not be evaluated, but is displayed on error.
 *                  Useful only a part of an expression is evaluated.
 * @param {boolean=true} formatErrors if true, then errors by the evaluated statement will be formatted to give clearer information
 * @return {*} the result of the expression
 */
function evaluate(expression, variables, line, currentExpression, formatErrors=true) {
    try {
        return vm.runInContext(expression, variables)
    }
    catch (e) {
        if (!formatErrors) {
            throw e
        }
        let expressionToDisplay = currentExpression === undefined ? expression : currentExpression
        let stack = e.stack.split('\n')
        let msg = `[${e.name}] ${e.message}\n`
        msg += stack[1] + '\n' + stack[2] + '\n'
        msg += `Erroneous expression [line ${line}]:\n${expressionToDisplay}\n`
        msg +=  '\n' + '-'.repeat(60) + '\n'
        console.error(msg)
        throw e
    }
}

module.exports = {
    GeneratedContent,
    normalizeCondition,
    evaluate
}