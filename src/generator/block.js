const vm = require('vm')

const {evaluate, GeneratedContent, normalizeCondition} = require('./helper')

const generateContent = require('./content')

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
    const conditionDisplay = `{% ${conditional}${control.condition}%}`

    let result = new GeneratedContent()
    let condition = normalizeCondition(block.control.condition)

    if (['if', 'elif', 'else'].includes(conditional)) {
        if (conditional === 'else' || evaluate(condition, variables, control.line, conditionDisplay)) {
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

        while (evaluate(condition, variables, control.line, conditionDisplay)) {
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
        const context = vm.createContext(Object.assign({}, variables, {
            __generateContent__: generateContent,
            __GeneratedContent__: GeneratedContent,
            __variables__: variables,
            __content__: block.content,
            __depth__: depth,
            __options__: options
        }))

        /* To handle for loops, we have to do the following inside a VM:
         *  - Use the for loop given inside the minescript to:
         *      - Check if the for loop added some variables (they are Minescript variables)
         *      Add these variables to the 'variables' object
         *      - Generate the content of the body, and add it to the result
         *      - Update the loop variables with their new values
         * - Return the result
         */
        const expr = `(function () {
            let result = new __GeneratedContent__()
            let oldVars = Object.keys(this)
            
            for${condition} {
                // Check for the variables the for loop added: they are minescript variables, 
                // so we need to assign them to variables object
                let newVars = Object.keys(this)
                let createdVars = newVars.filter(key => !oldVars.includes(key))
                Object.assign(__variables__, createdVars.reduce(function (obj, v) {obj[v] = this[v]; return obj}, {}))

                result.add(__generateContent__(__content__, __variables__, __depth__ + 1, __options__)) 
                
                // If a loop variable was updated inside the body, update it in the function
                for (let v of createdVars) {
                    this[v] = __variables__[v]
                }
            }
            return result
        })()`

        result.add(evaluate(expr, context, control.line, conditionDisplay, false))
        return result
    }

    let error = `Incorrect conditional statement "${conditional}"\n`
    error += 'This case is not supposed to be possible. There is an error in the program itself.\n'
    error += 'Problematic control block:\n' + JSON.stringify(control, null, 2)
    throw new SyntaxError(error)
}

module.exports = generateBlock