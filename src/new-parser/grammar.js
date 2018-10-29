// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "value", "symbols": ["literalValue"]},
    {"name": "value", "symbols": ["numericalValue"], "postprocess": data => data[0]},
    {"name": "literalValue", "symbols": ["variableName", "_", {"literal":"="}, "_", "quote", "literal", "quote", "_"], "postprocess": data => ({name:data[0], value:data[5], type:"literal"})},
    {"name": "numericalValue", "symbols": ["variableName", "_", {"literal":"="}, "_", /[^"\s]/, "anything", "_"], "postprocess": data => ({name:data[0], value:data[4] + data[5], type:"numerical"})},
    {"name": "variableName$ebnf$1", "symbols": [/[\w]/]},
    {"name": "variableName$ebnf$1", "symbols": ["variableName$ebnf$1", /[\w]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "variableName", "symbols": ["variableName$ebnf$1"], "postprocess": data => data[0].join('')},
    {"name": "quote", "symbols": [/["']/], "postprocess": data => data[0]},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["__"], "postprocess": d => null},
    {"name": "__", "symbols": ["w"]},
    {"name": "__", "symbols": ["__", "w"], "postprocess": d => null},
    {"name": "w", "symbols": [/[\s]/], "postprocess": d => null},
    {"name": "literal$ebnf$1", "symbols": [/./]},
    {"name": "literal$ebnf$1", "symbols": ["literal$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal", "symbols": ["literal$ebnf$1", /[^\"]/], "postprocess": data => data[0].join('') + data[1]},
    {"name": "literal$ebnf$2", "symbols": [/./]},
    {"name": "literal$ebnf$2", "symbols": ["literal$ebnf$2", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "literal$string$1", "symbols": [{"literal":"\\"}, {"literal":"\""}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "literal", "symbols": ["literal$ebnf$2", "literal$string$1"], "postprocess": data => data[0].join('') + data[1]},
    {"name": "literal", "symbols": [/./]},
    {"name": "literal", "symbols": []},
    {"name": "anything$ebnf$1", "symbols": []},
    {"name": "anything$ebnf$1", "symbols": ["anything$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "anything", "symbols": [/[^\s]/, "anything$ebnf$1", /[^\s]/], "postprocess": data => data[0] + data[1].join('') + data[2]},
    {"name": "anything", "symbols": [/[^\s]/]},
    {"name": "anything", "symbols": []}
]
  , ParserStart: "value"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
