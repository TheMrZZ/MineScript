const fs = require('fs')

const program = require('./src/argumentParser')
const scriptParser = require('./src/parser/script-parser')

const result = scriptParser(program.inputFile)
fs.writeFile(program.outputFile, result, 'utf8', err => {
    console.error(err)
})