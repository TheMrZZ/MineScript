const program = require('commander')
const path = require('path')

let inputFile = ''

function changeExtension(filePath, extension) {
    if (!filePath) return;

    let parsedFile = path.parse(filePath)
    let fileName = parsedFile.name + extension
    return path.join(parsedFile.dir, fileName)
}

program
    .version('1.0.0')
    .arguments('<input>')
    .action(input => { inputFile = input })
    .option('-o, --output', 'The output file. Defaults to the same file name, but with .mcfunction extension.')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit()
}

module.exports = {
    inputFile: inputFile,
    outputFile: program.output || changeExtension(inputFile, '.mcfunction')
}

console.log(module.exports)