const nearley = require('nearley')
const grammar = require('./grammar')
const fs = require('fs')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

function evaluate(expression, variables) {
    return new Function(expression).call(variables)
}

function parse(blockContent, variables) {
    for (const statement of blockContent) {
        const type = statement.type
        if (type === 'block') {
            parse(statement.content, variables)
        }
        else if (type === 'assignment') {

        }
    }
}

function parseFile(fileName) {
    const file = fs.readFileSync(fileName, 'utf8')
    parser.feed(file)
    let results = parser.results

    parse(results, {})
}

module.exports = parseFile