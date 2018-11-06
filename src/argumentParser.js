const program = require('commander')
const path = require('path')

let inputFolder = ''
let outputFolder = ''

program
    .version('1.0.0')
    .arguments('<inputFolder> <datapack>')
    .description('Compiles .mcscript or .minescript files located inside the given inputFolder.\n' +
        'The resulting .mcfunction files are stored inside the given datapack.')
    .action((input, datapack) => { inputFolder = input; outputFolder = datapack; })
    .option('-w, --warnings', 'Activates the warnings.')
    .option('-d, --debug', 'Activate the debug mode. Only useful for Minescript developers - not for users.')
    .parse(process.argv)

if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit()
}

function optionMissing(message) {
    console.error(message)
    program.outputHelp()
    process.exit(1)
}

module.exports = {
    inputFolder: inputFolder,
    outputFolder: outputFolder,
    warnings: program.warnings || program.debug || false,
    debug: program.debug || false,
}
