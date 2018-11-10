const nearley = require('nearley')
const grammar = require('./grammar/grammar')

/**
 * Use the nearley parser with our grammar on the given string.
 * @throws SyntaxError if the nearley parser gives 0 result
 * @throws SyntaxError if the nearley parser gives several different results
 * @throws SyntaxError if debug is on, and the nearley parser gives several identical results
 * @param string the string to parse
 * @param options the options
 * @return {Object} the result of the nearley parsing
 */
function parse(string, options) {

    const reportMessage = 'You can report at https://github.com/TheMrZZ/MineScript/issues.\n' +
                          'Please include the file you parsed and this error message to your report.'

    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar), {keepHistory: true})

    parser.feed(string)

    let results = parser.results
    if (results.length === 0) {
        throw new SyntaxError('Minescript compilation failed for an unknown reason.\n' +
                              'Check if every condition block {% if ... %}, {% while ... %}} ' +
                              'has a corresponding end block: {% endif %}, {% endwhile %}...\n' +
                              reportMessage)
    }


    if (results.length > 2) {
        /* This should NEVER happens in production.
         * If this happens, to avoid problems, if every
         * given result is the same, we display a warning,
         * but will take any result (since they're all the same)
         */
        let identical = true

        options.logDebug('RESULTS:')
        options.logDebug(JSON.stringify(results, null, 2))

        for (let i = 1; i < results.length; i++) {
            if (JSON.stringify(results[i - 1]) === JSON.stringify(results[i])) {
                options.logDebug(`Results ${i - 1} and ${i} are IDENTICAL`)
            }
            else {
                options.logDebug(`Results ${i - 1} and ${i} are DIFFERENT`)
                identical = false
            }
        }

        if (identical) {
            console.log("A minor bug happened - don't worry, it should not cause you any problem.")
            console.log('However, we would be glad if you could report the file you parsed along with this message.')
            console.log(reportMessage)
            if (options.debug) {
                throw new SyntaxError('Parser gave multiple identical results')
            }
        }
        else {
            throw new SyntaxError('Parser gave different possible results. ' +
                                  'This should not happen and is not your fault - its our.\n' +
                                  reportMessage)
        }
    }

    return results[0]
}

module.exports = parse