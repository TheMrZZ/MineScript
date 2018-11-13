const {evaluate, MinecraftFunction} = require('./helper')

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
 * @return {Promise.<String>} the result of the parsing
 */
async function generateCommandArgs(commandArgs, variables) {
    if (!commandArgs) {
        return ''
    }

    let result = ''
    for (const arg of commandArgs) {
        if (arg.type === 'literal') {
            result += arg.data
        }
        else {
            result += await evaluate(arg.data, variables, arg.line)
        }
    }
    return result
}

class NameError extends Error {}

/**
 * Generate the content of a block
 * @param {Object[]} blockContent the content of a block - a group of statements
 * @param {Object} variables the current variables
 * @param {int} depth the depth of the current block content
 * @param {Object} options the generator options
 * @returns {Promise.<MinecraftFunction>} the result of the parsing
 */
async function generateContent(blockContent, variables, depth, options) {
    let result = new MinecraftFunction()

    for (const statement of blockContent) {
        const type = statement.type
        switch (type) {
            case 'block':
                result.add(await generateBlock(statement, variables, depth, options))
                break
            case 'assignment':
                if (statement.name.startsWith("__")) {
                    let error = `Incorrect variable name ${statement.name.match(/\w+/)[0]}:\n`
                    error += "Variable names can't start with a double underscore '__'.\n"
                    error += "Variables starting by a double underscore '__' are reserved for special variables.\n"
                    error += `Erroneous expression [line ${statement.line}]:\n${statement.name}${statement.value}`
                    throw new NameError(error)
                }
                await evaluate(`${statement.name} ${statement.value}`, variables, statement.line)
                break
            case 'command':
                result.add(`${statement.command} ${await generateCommandArgs(statement.value, variables)}`)
                break
            case 'comment':
                if (statement.comment.startsWith('##')) {
                    result.add(statement.comment.slice(1))
                }
                break
            case 'initialExpression':
                result.add(await evaluate(statement.expression, variables, statement.line) +
                           await generateCommandArgs(statement.value, variables))
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