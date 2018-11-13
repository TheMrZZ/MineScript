const vm = require('vm')
const parser = require('../parser')

const generateContent = require('./content')

/**
 * Generate a mcfunction from the given string and returns the result
 * @param {string} string the string to generate
 * @param {Object} options the options of the generator
 * @returns {Promise.<MinecraftFunction>} the result of the parsing
 */
async function generate(string, options) {
    let tokens = parser(string, options)

    // Following libraries are imported in order to be used within minescripts.
    let variables = {
        require: require,
        Vector: require('../libraries/vector'),
    }

    let context = vm.createContext(variables)

    let content = await generateContent(tokens, context, 0, options)
    if (!options.noFooter) {
        content.add('# Created with MineScript: https://github.com/TheMrZZ/MineScript')
    }
    return content
}

module.exports = generate