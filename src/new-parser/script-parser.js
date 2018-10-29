const nearley = require('nearley')
const grammar = require('./grammar')
const fs = require('fs')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

function parse(fileName) {
    const file = fs.readFileSync(fileName, 'utf8')
    parser.feed('ab="abc"')
    console.log(parser.results)
}

module.exports = parse