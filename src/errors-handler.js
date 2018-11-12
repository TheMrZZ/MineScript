const colors = require('colors')

colors.setTheme({
    errorColor: 'red',
    legendColor: 'reset',
    successColor: 'green'
})

// Literals representation
const literalRepr = {
    "_": "[whitespaces]",
    "__": "whitespaces",
    "___": "whitespaces/newlines"
}

/**
 * Returns the current rule
 * @param generator the generator
 * @param table the current table
 * @return {string} the current rule
 */
function getCurrentRule(generator, table) {
    const currentState = table.states[table.states.length - 1]
    const currentStateName = currentState.rule.name
    const currentRule = generator.grammar.rules.filter(rule => rule.name === currentStateName)[0]

    return currentRule
}

/**
 * Get a keywords list from the lexer
 * @example
 * {
 *     condition: ["while", "if"],
 *     conditionEnd: ["endwhile", "endif"],
 * }
 * @param lexer the lexer
 * @return {*} a keyword list
 */
function getKeywords(lexer) {
    function getNewKeywords(state) {
        return state.groups.reduce((obj, group) => {
            // If this group match keywords, add it
            if (group.match.every(match => typeof match === 'string')) {
                obj[group.tokenType] = group.match
            }
            return obj
        }, {})
    }

    /* For every group in the every state of the lexer (a group is the value of a rule)
     * if it is an array of strings, it is an array of keywords.
     */
    let keywords = getNewKeywords(lexer.states[lexer.state])

    for (let stateName of Object.keys(lexer.states)) {
        const state = lexer.states[stateName]
        let newKeywords = getNewKeywords(state)

        // Can't reverse the order: old keywords have priority over newer keywords
        keywords = Object.assign(newKeywords, keywords)
    }

    return keywords
}

/**
 * Get any symbol's representation
 * @example
 * "%}" => "%}"
 * "_" => "whitespace"
 * "conditional" => '{"while"|'if'}'
 * @param symbol the symbol
 * @param keywords the current keywords
 * @return {string} the symbol's representation
 */
function symbolRepresentation(symbol, keywords) {
    // If the symbol is a literal with a custom representation, return it
    if (symbol in literalRepr) {
        return literalRepr[symbol]
    }

    // If the symbol matches an array of keywords, return them
    if (symbol.type in keywords) {
        return `{"${ keywords[symbol.type].join('"|"') }"}`
    }

    if (symbol.type !== undefined) {
        return symbol.type
    }

    if (symbol.literal !== undefined) {
        return `"${symbol.literal}"`
    }

    return symbol.toString()
}

function getSymbolErrorMessage(generator) {
    // Get the last used earley table, to know where things got wrong
    const lastTable = generator.table.reduce((final, table) => {
        if (table.states.length > 0)
            return table
        return final
    })

    const incorrectTokenIndex = lastTable.states[lastTable.states.length - 1].dot

    const keywords = getKeywords(generator.lexer)
    const currentRule = getCurrentRule(generator, lastTable)

    const expected = 'Expected: '
    let errorMsg = [expected, ' '.repeat(expected.length)]

    for (let i = 0; i < currentRule.symbols.length; i++) {
        const symbol = currentRule.symbols[i]

        let repr = symbolRepresentation(symbol, keywords)
        let char = ''

        // We need to get the length before changing the color, because the color changed the length
        let reprLength = repr.length
        if (i < incorrectTokenIndex) {
            repr = repr.successColor
            char = '✓'.successColor
        }
        else if (i === incorrectTokenIndex) {
            repr = repr.errorColor
            char = '✗'.errorColor
        }
        else {
            char = ' '
        }

        errorMsg[0] += repr + ' '
        errorMsg[1] += `${' '.repeat(reprLength / 2) + char + ' '.repeat((reprLength - 1) / 2)} `
    }

    return errorMsg.join('\n')
}

/**
 * Prints a detailed error message, then exit the program.
 * @param error the error returned
 * @param generator the current generator
 */
function handleError(error, generator) {
    const lexer = generator.lexer

    let legend = ['Legend:', '[] = optional', '{"a"|"b"} = "a" or "b"']
    legend = legend.join('\n\t• ').legendColor + '\n'

    let errorMsg = getSymbolErrorMessage(generator)
    console.log(legend.legendColor)
    console.log(lexer.formatError(error.token, 'Error: Invalid token').errorColor)
    console.log(errorMsg.errorColor)
}

module.exports = handleError