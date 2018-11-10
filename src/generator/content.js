const {evaluate, GeneratedContent, normalizeCondition} = require('./helper')

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
 * Generate any block
 * @param {Object} block the control block
 * @param {Object} variables the variables of the current scope
 * @param {int} depth depth of the current block
 * @param {Object} options the generator options
 * @returns {GeneratedContent} the result of the parsing
 */
function generateBlock(block, variables, depth, options) {
    const control = block.control
    const conditional = control.conditional
    const conditionDisplay = `{% ${conditional} ${control.condition} %}`

    let result = new GeneratedContent()
    let argument = normalizeCondition(block.control.condition)

    if (['if', 'elif', 'else'].includes(conditional)) {
        if (conditional === 'else' || evaluate(argument, variables, control.line, conditionDisplay)) {
            result = generateContent(block.content, variables, depth + 1, options)
        }
        else if (block.else) {
            result = generateBlock(block.else, variables, depth, options)
        }
        return result
    }


    if (conditional === 'while') {
        let numberOfLoops = 0
        let warning = 10000

        while (evaluate(argument, variables, control.line, conditionDisplay)) {
            result.add(generateContent(block.content, variables, depth + 1, options))

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

    if (conditional === 'for') {
        /* Here is a dirty piece of hack. In order to use the
         * built-in for loop, we can't just use for(condition) {}.
         * Here, the condition is not a classical condition,
         * and evaluating it won't do anything.
         *
         * We don't know the variable used either.
         * Reimplementing the loops is possible, but hard and bug prone.
         *
         * Here is the solution chosen:
         * First, set loopNumber to 0
         * Then, in a while loop:
         *  - Evaluate the for inside 'evaluate'
         *  - When we're at loop "loopNumber", return "true" (meaning the loop should keep going on)
         *    This sets the correct variables for the current loop number
         *  - Outside of eval, while the evaluation is true, generate the block content
         *  - Increase loopNumber
         *  - Start from the beginning of the loop
         *
         *  Huge problem: if any side variable is used inside the condition,
         *  if the loop variable isn't initialized at start, or if the loop variable is changed inside the block,
         *  then its value will be unpredictable. For the moment, I didn't find a way to fix this.
         */
        function getExpression(condition, loopNumber) {
            const counterName = '$$__counter__$$' + loopNumber
            return `(function () {
            let ${counterName}=0
            for(${condition}) {
                if(${counterName} >= ${loopNumber}) return ${counterName}
                ${counterName}++
            }
            return undefined
            })()`
        }

        let loopNumber = 0
        let expr = getExpression(control.condition, loopNumber)
        while (evaluate(expr, variables, control.line) !== undefined) {
            result.add(generateContent(block.content, variables, depth + 1, options))
            loopNumber++
            expr = getExpression(control.condition, loopNumber)
        }

        return result
    }

    let error = `Incorrect conditional statement "${conditional}"\n`
    error += 'This case is not supposed to be possible. There is an error in the program itself.\n'
    error += 'Problematic control block:\n' + JSON.stringify(control, null, 2)
    throw new SyntaxError(error)
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

module.exports = generateContent