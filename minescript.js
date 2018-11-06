const fs = require('fs')
const file = require('file')
const path = require('path')
const colors = require('colors') // Do not remove - side-effects are used

const program = require('./src/argumentParser')
const scriptParser = require('./src/parser/script-parser')

function getOutputFile(inputRelativeFile, extension) {
    let outputFile = path.join(program.outputFolder, inputRelativeFile)

    let parsedFile = path.parse(outputFile)
    return parsedFile.name + extension
}

file.walk(program.inputFolder, (err, dirPath, dirs, files) => {
    files.forEach(relativeFilePath => {
        console.log(relativeFilePath)
        if (!['.mcscript', '.minescript'].includes(path.parse(relativeFilePath).ext)) {
            return
        }

        const result = scriptParser(relativeFilePath)
        const outputFile = getOutputFile(relativeFilePath, '.mcfunction')
        console.log(result)
        fs.writeFile(outputFile, result, 'utf8', err => {
            if (err) {
                console.error(err)
                throw err
            }
            else {
                console.log('Compilation is successful!'.green)
            }
        })
    })
})

