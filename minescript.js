const fs = require('fs')
const file = require('file')
const path = require('path')
const colors = require('colors') // Do not remove - side-effects are used

const program = require('./src/argumentParser')
const scriptParser = require('./src/parser/script-parser')

function getOutputFile(relativeInputFile, subFolder, extension) {
    let inputFile = path.parse(relativeInputFile)
    let outputFile = path.join(program.outputFolder, subFolder, inputFile.dir, '../', inputFile.name + extension)
    return outputFile
}

file.walk(program.inputFolder, (err, dirPath, dirs, files) => {
    files.forEach(relativeFilePath => {
        if (!['.mcscript', '.minescript'].includes(path.parse(relativeFilePath).ext)) {
            return
        }

        const result = scriptParser(relativeFilePath)
        const outputFile = getOutputFile(relativeFilePath, 'functions', '.mcfunction')
        console.log(outputFile)
        fs.writeFile(outputFile, result, 'utf8', err => {
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

