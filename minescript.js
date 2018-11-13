const fs = require('fs')
const file = require('file')
const path = require('path')

// noinspection JSUnusedLocalSymbols
const colors = require('colors') // Do not remove - side-effects are used

const options = require('./src/argumentParser')
const scriptParser = require('./src/generator/file')

function getOutputFile(inputFolder, relativeInputFile, subFolder, extension) {
    let relativeOutputFile = path.dirname(path.relative(inputFolder, relativeInputFile))
    let name = path.parse(relativeInputFile).name
    let outputFile = path.join(options.outputFolder, relativeOutputFile, subFolder, name + extension)
    return outputFile
}

file.walk(options.inputFolder, (err, dirPath, dirs, files) => {
    files.forEach(relativeFilePath => {
        if (!['.mcscript', '.minescript'].includes(path.parse(relativeFilePath).ext)) {
            return
        }

        const string = fs.readFileSync(relativeFilePath, 'utf8')

        scriptParser(string, options).then(result => {
            const outputFile = getOutputFile(options.inputFolder, relativeFilePath, 'functions', '.mcfunction')

            if (options.debug) {
                console.log(result)
            }

            fs.writeFile(outputFile, result.statements.join('\n'), 'utf8', err => {
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
})