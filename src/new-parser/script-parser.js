const nearley = require('nearley')
const grammar = require('./grammar')
const fs = require('fs')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

function parse(fileName) {
    const file = fs.readFileSync(fileName, 'utf8')
    parser.feed(file)
    let results = parser.results

    for (let i = 1; i < parser.results.length; i++) {
        const result = JSON.stringify(parser.results[i])
        const old = JSON.stringify(parser.results[i - 1])

        if (result !== old) {
            console.log('NOT IDENTICAL')
        }
        else {
            console.log('IDENTICAL')
        }
    }

    console.log(JSON.stringify(results, null, 2))
}

module.exports = parse