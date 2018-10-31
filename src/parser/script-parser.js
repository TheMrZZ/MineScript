const nearley = require('nearley')
const grammar = require('./grammar/grammar')
const fs = require('fs')

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar))

/**
 * Normalize a condition, for example by puting === instead of ==
 */
function getCondition(expression) {

}

function evaluate(expression, variables) {
    return new Function(`return ${expression}`).call(variables)
}

function parseCommand(command_, variables) {
    const command = command_
    const args = command_.args


}

function parseBlock(block, variables) {
    let result = ''

    if (block.controlType === 'if') {
        if (evaluate(block.controlArgument, variables)) {
            result = parse(block.content)
        }
        return result
    }

    if (block.controlType === 'while') {
        while (evaluate(block.controlArgument)) {
            result += parse(block.content, variables)
        }
        return result
    }
}

function parse(blockContent, variables) {
    let result = ''
    for (const statement of blockContent) {
        const type = statement.type

        switch (type) {
            case 'block':
                result += parseBlock(statement, variables)
                break
            case 'assignment':
                evaluate(`${statement.name} = ${statement.value}`, variables)
                break
            case 'command':
                result += `${statement.command} ${statement.args}\n`
                break
            case 'comment':
                result += statement.comment + '\n'
                break
            default:
                let error = 'Incorrect statement type: ' + type + '\n'
                error += 'This case is not supposed to be possible. There is an error in the program itself.'
                throw new Error(error)
        }
    }

    return result
}

function parseFile(fileName) {
    fs.readFile(fileName, 'utf8', (err, fileContent) => {
        const file = fs.readFileSync(fileName, 'utf8')
        parser.feed(file)
        let results = parser.results

        console.log(JSON.stringify(results, null, 2))

        return parse(results, {})
    })
}

module.exports = parseFile