// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "blockInside", "symbols": []},
    {"name": "blockInside", "symbols": ["blockInside_"], "postprocess": id},
    {"name": "blockInside_", "symbols": ["line", "newline", "line"], "postprocess": data => {return [data[0], data[2]]}},
    {"name": "line", "symbols": ["valueAssignement"], "postprocess": id},
    {"name": "line", "symbols": ["minecraftCommand"], "postprocess": id},
    {"name": "minecraftCommand", "symbols": ["word", "__", /[^\s=]/, "anything", "_"], "postprocess": data => ({command: data[0], args: data[2] + data[3], type: 'command'})},
    {"name": "valueAssignement", "symbols": ["word", "_", {"literal":"="}, "_", "anything", "_"], "postprocess": data => ({name: data[0], value: data[4], type: 'assignement'})},
    {"name": "word$ebnf$1", "symbols": [/[\w]/]},
    {"name": "word$ebnf$1", "symbols": ["word$ebnf$1", /[\w]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "word", "symbols": ["word$ebnf$1"], "postprocess": data => data[0].join('')},
    {"name": "quote", "symbols": [/["']/], "postprocess": id},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["__"], "postprocess": () => null},
    {"name": "__", "symbols": ["w"]},
    {"name": "__", "symbols": ["__", "w"], "postprocess": () => null},
    {"name": "w", "symbols": [/[\s]/], "postprocess": () => null},
    {"name": "newline$ebnf$1", "symbols": ["newline_"]},
    {"name": "newline$ebnf$1", "symbols": ["newline$ebnf$1", "newline_"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newline", "symbols": ["_", "newline$ebnf$1"], "postprocess": () => null},
    {"name": "newline_", "symbols": [{"literal":"\r"}, {"literal":"\n"}], "postprocess": () => null},
    {"name": "newline_", "symbols": [{"literal":"\r"}], "postprocess": () => null},
    {"name": "newline_", "symbols": [{"literal":"\n"}], "postprocess": () => null},
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
  , ParserStart: "blockInside"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
