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
    .option('-w, --warnings', 'Activates the warnings.')
    .option('-d, --debug', 'Activate the debug mode. Only useful for Minescript developers - not for users.')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit()
}

module.exports = {
    inputFile: inputFile,
    outputFile: program.output || changeExtension(inputFile, '.mcfunction'),
    warnings: program.warnings || program.debug || false,
    debug: program.debug || false,
}
