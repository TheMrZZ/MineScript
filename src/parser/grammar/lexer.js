const moo = require('moo')

const globalRules = {
    newlines: {match: /\s*[\r\n]/, lineBreaks: true},
    ws: /[ \t\v\f]+/,
    error: moo.error
}

const conditionals = ["if", "while"]
const conditionalEnds = conditionals.map(c => c + 'end')

let states = {
    main: {
        "{%": {match: "{%", push: 'controlBlock'},
    },

    controlBlock: {
        conditional: {match: conditionals},
        conditionalEnd: conditionalEnds,
        condition: {
            match: /(?:[^%]|%[^}])+/,
            value: s => s.trim(),
            lineBreaks: true},
        "}%": {match: "%}", pop: true},
    }
}

// Apply global rules to states
for (let state in states) {
    states[state] = Object.assign({}, globalRules, states[state])
}
const lexer = moo.states(states)

module.exports = lexer