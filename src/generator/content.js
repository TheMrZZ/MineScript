const {evaluate, GeneratedContent} = require('./helper')

module.exports = generateContent

/* We have to require generateBlock AFTER exporting generateContent.
 * The reason is circular dependencies:
 * generateContent will call generateBlock, but generateBlock can call generateContent too.
 *
 * Therefore, including each other at the top of the file will result in a circular dependency, and one of the
 * function will not be imported at all.
 *
 * By exporting generateContent before, we make sure that at the moment generateBlock calls generateContent,
 * generateContent exists!
 */

const generateBlock = require('./block')

/**
 * Generate a command from command arguments
 * @param commandArgs the arguments to generate
 * @param variables the current variables
 * @return {string} the result of the parsing
 */
function generateCommandArgs(commandArgs, variables) {
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
 * Generate the content of a block
 * @param {Object[]} blockContent the content of a block - a group of statements
 * @param {Object} variables the current variables
 * @param {int} depth the depth of the current block content
 * @param {Object} options the generator options
 * @returns {GeneratedContent} the result of the parsing
 */
function generateContent(blockContent, variables, depth, options) {
    let result = new GeneratedContent()

    for (const statement of blockContent) {
        const type = statement.type
        switch (type) {
            case 'block':
                result.add(generateBlock(statement, variables, depth, options))
                break
            case 'assignment':
                evaluate(`${statement.name} ${statement.value}`, variables, statement.line)
                break
            case 'command':
                result.add(`${statement.command} ${generateCommandArgs(statement.value, variables)}`)
                break
            case 'comment':
                if (statement.comment.startsWith('##')) {
                    result.add(statement.comment.slice(1))
                }
                break
            case 'initialExpression':
                result.add(evaluate(statement.expression, variables, statement.line) +
                           generateCommandArgs(statement.value, variables))
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