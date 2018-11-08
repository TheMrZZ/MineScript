const program = require('commander')

let inputFolder = ''
let outputFolder = ''

program
    .version('1.0.0')
    .arguments('<inputFolder> <namespaceFolder>')
    .description('Compiles .mcscript or .minescript files located inside the given inputFolder.\n' +
        'The resulting .mcfunction files are stored inside the given namespaceFolder - located inside a datapack.')
    .action((input, namespace) => { inputFolder = input; outputFolder = namespace; })
    .option('-w, --warnings', 'Activates the warnings.')
    .option('-d, --debug', 'Activate the debug mode. Only useful for Minescript developers - not for users.')
    .option('-q, --quiet', "Don't show log messages. Errors will still be displayed.")
    .option('--no-footer', 'Hide the "Created with MineScript" comment at the end of functions.')
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

// Disable stdout, but not stderr
if (program.quiet) {
    process.stdout.write = () => {};
}

module.exports = {
    inputFolder: inputFolder,
    outputFolder: outputFolder,
    warnings: program.warnings || program.debug || false,
    logDebug: program.debug ? console.log : () => undefined,
    debug: program.debug || false,
    noFooter: program.noFooter || false,
}
