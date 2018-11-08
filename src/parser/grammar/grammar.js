// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const {lexer, conditionals} = require("./lexer")
    
    const dataJoin = data => data.join('')

    /**
     * Add a value to an array, then returns the array
     * @param array the array in which to add the value
     * @param value the value to add
     * @param [unshift=true] if false, then the value will be added at the end of the array - not at the start. 
     */
    function addToArray (array, value, unshift=true) {
        if (unshift) {
            array.unshift(value)
        }
        else {
            array.push(value)
        }
        return array
    }

    /**
     * Unescape a string
     * @param string the string to unescape
     * @return {string} the unescaped string
     */
    function unescape (string) {
        
    }

    let conditionStack = []
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": ["_nl"], "postprocess": id},
    {"name": "main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main$ebnf$2", "symbols": ["nl_"], "postprocess": id},
    {"name": "main$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "main", "symbols": ["main$ebnf$1", "statementBlock", "main$ebnf$2"], "postprocess": data => data[1]},
    {"name": "block", "symbols": ["controlStatement", "blockInside", "endControlStatement"], "postprocess": data => ({type: 'block', control: data[0], content: data[1], controlEnd: data[2]})},
    {"name": "controlStatement", "symbols": [{"literal":"{%"}, "___", (lexer.has("conditional") ? {type: "conditional"} : conditional), "ws", (lexer.has("condition") ? {type: "condition"} : condition), "___", {"literal":"%}"}], "postprocess":  data => {
            const conditional = data[2].value
            conditionStack.push(conditional)
            return {conditional: conditional, condition: data[4].value, line: data[2].line}
        }},
    {"name": "endControlStatement", "symbols": [{"literal":"{%"}, "___", (lexer.has("conditionalEnd") ? {type: "conditionalEnd"} : conditionalEnd), "___", {"literal":"%}"}], "postprocess":  (data, loc, reject) => {
            const conditionalEnd = data[2].value
            const previousConditional = conditionStack.pop()
        
            if (conditionals[previousConditional] !== conditionalEnd) {
                throw new SyntaxError('Error: ' + previousConditional + ' does not match ' + conditionalEnd)
                return reject
            }
            
            return {conditional: conditionalEnd, condition: null, line: data[2].line}
        }},
    {"name": "blockInside", "symbols": ["_nl", "statementBlock", "nl_"], "postprocess": data => data[1]},
    {"name": "blockInside", "symbols": ["_nl_"], "postprocess": () => []},
    {"name": "blockInside", "symbols": [], "postprocess": () => []},
    {"name": "statementBlock", "symbols": [], "postprocess": () => []},
    {"name": "statementBlock", "symbols": ["statement"]},
    {"name": "statementBlock", "symbols": ["statement", "nl", "statementBlock"], "postprocess": data => addToArray(data[2], data[0])},
    {"name": "statement", "symbols": ["_", "statement_", "_"], "postprocess": data => data[1]},
    {"name": "statement_", "symbols": ["block"], "postprocess": id},
    {"name": "statement_", "symbols": ["initialExpression"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftComment"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftCommand"], "postprocess": id},
    {"name": "statement_", "symbols": ["valueAssignment"], "postprocess": id},
    {"name": "minecraftComment", "symbols": [{"literal":"#"}, "_", (lexer.has("comment") ? {type: "comment"} : comment)], "postprocess": data => ({type: 'comment', comment: data.join(''), line: data[2].line})},
    {"name": "valueAssignment$ebnf$1", "symbols": [(lexer.has("valueRight") ? {type: "valueRight"} : valueRight)], "postprocess": id},
    {"name": "valueAssignment$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "valueAssignment", "symbols": [(lexer.has("valueLeft") ? {type: "valueLeft"} : valueLeft), "_", "valueAssignment$ebnf$1"], "postprocess": data => ({type: 'assignment', name: data[0].value, value: data[2] ? data[2].value : undefined, line: data[0].line})},
    {"name": "initialExpression$ebnf$1", "symbols": ["commandValue"], "postprocess": id},
    {"name": "initialExpression$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "initialExpression", "symbols": [(lexer.has("expression") ? {type: "expression"} : expression), "initialExpression$ebnf$1"], "postprocess": data => ({type: 'initialExpression', expression: data[0].value, value: data[1], line: data[0].line})},
    {"name": "minecraftCommand", "symbols": [(lexer.has("command") ? {type: "command"} : command), "commandValue"], "postprocess": data => ({type: 'command', command: data[0].value, value: data[1], line: data[0].line})},
    {"name": "commandValue", "symbols": ["commandValue_"], "postprocess": data => [data[0]]},
    {"name": "commandValue", "symbols": ["commandValue_", "commandValue"], "postprocess": data => addToArray(data[1], data[0])},
    {"name": "commandValue_", "symbols": [(lexer.has("literal") ? {type: "literal"} : literal)], "postprocess": data => ({type: 'literal', data: data[0].value, line: data[0].line})},
    {"name": "commandValue_", "symbols": [(lexer.has("expression") ? {type: "expression"} : expression)], "postprocess": data => ({type: 'expression', data: data[0].value, line: data[0].line})},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "ws", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id},
    {"name": "___", "symbols": ["_", "nl", "_"], "postprocess": dataJoin},
    {"name": "___", "symbols": ["_"], "postprocess": id},
    {"name": "nl", "symbols": [(lexer.has("newlines") ? {type: "newlines"} : newlines)], "postprocess": id},
    {"name": "nl", "symbols": [(lexer.has("newlines") ? {type: "newlines"} : newlines), "ws", "nl"], "postprocess": data => data[0]},
    {"name": "_nl_", "symbols": ["_", "nl", "_"], "postprocess": dataJoin},
    {"name": "_nl", "symbols": ["nl"], "postprocess": id},
    {"name": "_nl", "symbols": ["ws", "nl"], "postprocess": dataJoin},
    {"name": "nl_", "symbols": ["nl"], "postprocess": id},
    {"name": "nl_", "symbols": ["nl", "ws"], "postprocess": dataJoin}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
