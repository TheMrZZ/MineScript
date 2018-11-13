const program = require('commander')

let inputFolder = ''
let outputFolder = ''

program
    .version('0.0.2-alpha')
    .arguments('<inputFolder> <namespaceFolder>')
    .description('Compiles .mcscript or .minescript files located inside the given inputFolder.\n' +
        'The resulting .mcfunction files are stored inside the given namespaceFolder - located inside a datapack.')
    .action((input, namespace) => { inputFolder = input; outputFolder = namespace; })
    .option('-w, --warnings', 'Activates the warnings.')
    .option('-q, --quiet', "Don't show log messages. Errors will still be displayed.")
    .option('-t, --time', 'Show the time taken by each file, and by the whole process')
    .option('--no-footer', 'Hide the "Created with MineScript" comment at the end of functions.')
    .option('--developer', 'Activate the developer mode. Only useful for Minescript developers - probably not for you.')
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
    time: program.time,
    warnings: program.warnings || program.debug || false,
    logDebug: program.debug ? console.log : () => undefined,
    debug: program.debug || false,
    noFooter: program.noFooter || false,
}
