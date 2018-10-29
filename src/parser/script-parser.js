const Parser = require('expr-eval').Parser
const fs = require('fs')
const colors = require('colors')
const path = require('path')

/* Matches: an identifier, then possibly whitespaces,
 *          then 1 non-quote character (to be sure that
 *          this is not a string), then anything.
 *          -- variable = sin(PI/2)
 */
const numberDeclaration = /^(\w+)\s*=\s*([^"\s].*)\s*$/

// Matches a literal string -- variable = "abc"
const stringDeclaration = /^(\w+)\s*=\s*"\s*(.+)\s*"\s*$/

// Matches a variable use with no backslash before brackets -- {{ variable }}
const variableUse = /(?!\\){{\s*(.+)\s*(?!\\)}}/g

const toReplace = [
    [/(?!\\)\}}/, '}}'],
    [/(?!\\)\{{/, '{{']
]
let errors = 0

colors.setTheme({
    success: 'green'
})

/**
 * Takes a line & replace the expressions by their values
 * e.g.: variables = { x: 85 }, line = "ab {{ x }}",
 *       result = "ab 85"
 * @param line      {String} the line to evaluate
 * @param variables {Object} the variables of the expression
 * @returns         {String} the line with the evaluated expressions
 */
function evaluateExpressions(line, variables) {
    line = line.replace(variableUse, (fullMatch, expression) => {
        const expr = Parser.parse(expression)
        const value = expr.evaluate(variables)

        if (Number.isNaN(value)) {
            const notNumbers = expr.symbols().filter(v => {
                return isNaN(variables[v])
            }).map(v => {
                return `${v}='${variables[v]}'`
            })
            const error = `Error: ${fullMatch} has non-numbers operands (${notNumbers.join(', ')}).`
            console.error(error)
            console.error('Mathematical operations can be performed on numbers only.')
            errors++
        }
        return value
    })

    return line
}

/**
 * Changes the extension of a file for a given one
 * @param fileName      {String} the name of the file to change the extension
 * @param newExtension  {String} the new extension
 * @return              {String} the new file name.
 */
function changeFileExtension(fileName, newExtension) {
    const nameParse = path.parse(fileName)
    const nameWithoutExtension = path.join(nameParse.dir, nameParse.name)
    const newName = nameWithoutExtension + '.' + newExtension
    return newName
}

/**
 * Compile a .mcscript file to a .mcfunction file
 * @param fileName name of the file to parse
 * @param variables default variables
 */
function parse(fileName, variables = {}) {
    const parser = new Parser()
    let errors = 0

    fs.readFile(fileName, 'utf8', (err, response) => {
        let lines = response.split('\n')
        let result = []

        lines.forEach(line => {
            const numberMatch = line.match(numberDeclaration)
            const stringMatch = line.match(stringDeclaration)
            const match = stringMatch || numberMatch

            // If the line is a variable assignment, create the variable and don't put the line in the results
            if (numberMatch || stringMatch) {
                const name = match[1]
                const value = match[2]

                if (stringMatch) {
                    variables[name] = value
                }
                else {
                    variables[name] = parser.evaluate(value, variables)
                }
                return
            }

            // Replace {{ variables }} by their values
            line = evaluateExpressions(line, variables)

            result.push(line.trim())
        })

        if (errors) {
            console.error(`Compilation failed after ${errors} error${errors > 1 ? 's' : ''}.`)
            process.exit(1)
        }

        const finalText = result.join('\n').trim()
        const newFileName = changeFileExtension(fileName, 'mcfunction')

        fs.writeFile(newFileName, finalText, 'utf8', err => {
            if (err) console.error(err)
            else console.log('Minecraft script was successfully compiled into a Minecraft function!'.success)
        })
    })
}

module.exports = parse