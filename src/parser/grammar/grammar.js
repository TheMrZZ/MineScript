// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const lexer = require("./lexer")
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": [{"literal":"{%"}, "_", (lexer.has("conditional") ? {type: "conditional"} : conditional), "__", (lexer.has("condition") ? {type: "condition"} : condition), "_", {"literal":"%}"}], "postprocess": data => ({conditional: data[2], condition: data[4]})},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]},
    {"name": "__", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
