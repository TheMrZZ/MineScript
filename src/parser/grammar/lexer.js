const moo = require('moo')

/**
 * Get a regular expression, matching everything until the given string.
 * It will match the given string too if it is escaped by a backslash
 * @param  {string} string the string until which the regex will match
 * @param {string} [quantifier = "+"] the final quantifier
 * @return {RegExp} a regular expression matching everything until the given string
 */
function until(string, quantifier = "+") {
    let regex = String.raw`(?:\\${string}|(?!${string}).)+`
    return RegExp(regex)
}

/**
 * Get a regular expression, matching everything between the start and the end strings
 * (including themself).
 * @param {string} start the start of the regular expression
 * @param {string} end the end of the regular expression
 * @param {boolean} [canBeEmpty = false] if true, then it's possible to have nothing between start and end
 *                                      - else at least 1 character is required
 */
function between(start, end, canBeEmpty = false) {
    let quantifier = "+"
    if (canBeEmpty) {
        quantifier = "*"
    }
    return addRegex(new RegExp(start), until(end, quantifier), new RegExp(end))
}

/**
 * Add multiple regex by chaining them
 * @param regexs the sum of the regular expressions
 */
function addRegex(...regexs) {
    let regexString = ''
    regexs.forEach(regex => {
        regexString += regex.source || regex
    })

    return new RegExp(regexString)
}

const globalRules = {
    newlines: {match: /[\r\n]+/, lineBreaks: true},
    ws: /[ \t\v\f]+/,
    error: moo.error,
}

const conditionals = {
    if: "endif",
    while: "endwhile"
}

let states = {
    main: {
        "{%": {match: "{%", push: 'controlBlock'},
        "#": {match: "#", push: 'commentBlock'},
        valueLeft: {
            match: /[\w][\w\d]*\s*[/%*+-]?=/,
            lineBreaks: false,
            push: 'assignmentBlock'
        },
        command: {match: /[a-z]+ /, push: 'commandBlock', value: s => s.trim()},
        expression: {
            match: between("{{", "}}", true),
            push: 'commandBlock',
            value: s => s.slice(2, -2).trim(),
            lineBreaks: true
        }
    },

    controlBlock: {
        conditional: Object.keys(conditionals),
        conditionalEnd: Object.values(conditionals),
        condition: {
            match: addRegex(/(?!\s)/, until("%}")),
            value: s => s.trim(),
            lineBreaks: true
        },
        "}%": {match: "%}", pop: true},
    },
    assignmentBlock: {
        valueRight: {match: /[^=\s].*/, lineBreaks: false, pop: true}
    },

    commandBlock: {
        literal: {match: until("{{"), lineBreaks: false},
        expression: {
            match: between("{{", "}}", true),
            value: s => s.slice(2, -2).trim(),
            lineBreaks: true,
        },
        // End of line => need to go back to the main stack
        newlines: {match: /[\r\n]+/, lineBreaks: true, pop: true}
    },

    commentBlock: {
        comment: {match: /.+/, lineBreaks: false, pop: true}
    },


}

/*
 * Apply global rules to states. This order allows the states
 * rules to override global rules, giving them higher priority.
 * Global rules are added at the end, so they have the lowest token priority.
 */
for (let stateName in states) {
    let state = states[stateName]
    for (const rule of Object.keys(globalRules)) {
        if (!state.hasOwnProperty(rule)) {
            state[rule] = globalRules[rule]
        }
    }
}

const lexer = moo.states(states)
module.exports = {lexer, conditionals}
