const scriptParser = require('./src/new-parser/script-parser')

const args = process.argv.slice(2);
const name = args[0]

scriptParser(name)