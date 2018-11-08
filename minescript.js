const fs = require('fs')
const file = require('file')
const path = require('path')
const colors = require('colors') // Do not remove - side-effects are used

const program = require('./src/argumentParser')
const scriptParser = require('./src/parser/script-parser')

function getOutputFile(inputFolder, relativeInputFile, subFolder, extension) {
    let relativeOutputFile = path.dirname(path.relative(inputFolder, relativeInputFile))
    let name = path.parse(relativeInputFile).name
    let outputFile = path.join(program.outputFolder, relativeOutputFile, subFolder, name + extension)
    return outputFile
}

file.walk(program.inputFolder, (err, dirPath, dirs, files) => {
    files.forEach(relativeFilePath => {
        if (!['.mcscript', '.minescript'].includes(path.parse(relativeFilePath).ext)) {
            return
        }

        const string = fs.readFileSync(relativeFilePath, 'utf8')

        const result = scriptParser(string)
        const outputFile = getOutputFile(program.inputFolder, relativeFilePath, 'functions', '.mcfunction')

        if (program.debug) {
            console.log(result)
        }

        fs.writeFile(outputFile, result.function.join('\n'), 'utf8', err => {
            if (err) {
                console.error(err)
                throw err
            }
            else {
                console.log(`[${relativeFilePath}] Compilation successful!`.green)
            }
        })
    })
})