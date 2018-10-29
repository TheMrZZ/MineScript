// Generated automatically by nearley, version 2.15.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

    const nuller = () => null
    const dataJoin = (data) => data.join('')
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "word$ebnf$1", "symbols": [/[\w]/]},
    {"name": "word$ebnf$1", "symbols": ["word$ebnf$1", /[\w]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "word", "symbols": ["word$ebnf$1"], "postprocess": data => data[0].join('')},
    {"name": "quote", "symbols": [/["']/], "postprocess": id},
    {"name": "newlines", "symbols": ["newlines_"], "postprocess": nuller},
    {"name": "newlines", "symbols": ["newlines_", "__", "newlines"], "postprocess": nuller},
    {"name": "newlines_$ebnf$1", "symbols": ["newlineChar"]},
    {"name": "newlines_$ebnf$1", "symbols": ["newlines_$ebnf$1", "newlineChar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "newlines_", "symbols": ["newlines_$ebnf$1"], "postprocess": () => 'blank'},
    {"name": "newlineChar", "symbols": [{"literal":"\r"}], "postprocess": nuller},
    {"name": "newlineChar", "symbols": [{"literal":"\n"}], "postprocess": nuller},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": ["__"], "postprocess": nuller},
    {"name": "__", "symbols": ["w"]},
    {"name": "__", "symbols": ["__", "w"], "postprocess": nuller},
    {"name": "w", "symbols": [/[ \t\v\f]/], "postprocess": nuller},
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
    {"name": "anything", "symbols": [/[^\s]/], "postprocess": id},
    {"name": "anything", "symbols": [], "postprocess": () => ""},
    {"name": "main", "symbols": ["block"], "postprocess": id},
    {"name": "controlCondition$ebnf$1", "symbols": []},
    {"name": "controlCondition$ebnf$1", "symbols": ["controlCondition$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "controlCondition", "symbols": [/[^\s]/, "controlCondition$ebnf$1", "controlConditionEnd"], "postprocess": data => data[0] + data[1].join('') + data[2]},
    {"name": "controlCondition", "symbols": [/[^\s%]/, /[^\s}]/], "postprocess": dataJoin},
    {"name": "controlCondition", "symbols": [/[^\s]/], "postprocess": id},
    {"name": "controlConditionEnd", "symbols": [/[^\s}]/], "postprocess": dataJoin},
    {"name": "controlConditionEnd", "symbols": [/[^%]/, {"literal":"}"}], "postprocess": dataJoin},
    {"name": "controlConditionEnd$string$1", "symbols": [{"literal":"\\"}, {"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlConditionEnd", "symbols": ["controlConditionEnd$string$1"], "postprocess": id},
    {"name": "controlBlockIfElse$macrocall$2$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$2", "symbols": ["controlBlockIfElse$macrocall$2$string$1"]},
    {"name": "controlBlockIfElse$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$1", "symbols": ["controlBlockIfElse$macrocall$1$string$1", "_", "controlBlockIfElse$macrocall$2", "__", "controlCondition", "_", "controlBlockIfElse$macrocall$1$string$2", "_"]},
    {"name": "controlBlockIfElse$macrocall$4$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$4", "symbols": ["controlBlockIfElse$macrocall$4$string$1"]},
    {"name": "controlBlockIfElse$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$3$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$3", "symbols": ["controlBlockIfElse$macrocall$3$string$1", "_", "controlBlockIfElse$macrocall$4", "__", "controlCondition", "_", "controlBlockIfElse$macrocall$3$string$2", "_"]},
    {"name": "controlBlockIfElse$macrocall$6$string$1", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$6", "symbols": ["controlBlockIfElse$macrocall$6$string$1"]},
    {"name": "controlBlockIfElse$macrocall$5$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$5$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$5", "symbols": ["controlBlockIfElse$macrocall$5$string$1", "_", "controlBlockIfElse$macrocall$6", "__", "controlCondition", "_", "controlBlockIfElse$macrocall$5$string$2", "_"]},
    {"name": "controlBlockIfElse", "symbols": ["controlBlockIfElse$macrocall$1", "newlines", "blockInside", "newlines", "controlBlockIfElse$macrocall$3", "newlines", "blockInside", "newlines", "controlBlockIfElse$macrocall$5"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: true,
                if: {
                    controlStructure: data[0],
                    statements: data[2]
                },
                else: {
                    controlStructure: data[4],
                    statements: data[6]
                }
            }
        }
        },
    {"name": "block$macrocall$2$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$2", "symbols": ["block$macrocall$2$string$1"]},
    {"name": "block$macrocall$3$string$1", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}, {"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3", "symbols": ["block$macrocall$3$string$1"]},
    {"name": "block$macrocall$1$macrocall$2", "symbols": ["block$macrocall$2"]},
    {"name": "block$macrocall$1$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$1", "symbols": ["block$macrocall$1$macrocall$1$string$1", "_", "block$macrocall$1$macrocall$2", "__", "controlCondition", "_", "block$macrocall$1$macrocall$1$string$2", "_"]},
    {"name": "block$macrocall$1$macrocall$4", "symbols": ["block$macrocall$3"]},
    {"name": "block$macrocall$1$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$3$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$3", "symbols": ["block$macrocall$1$macrocall$3$string$1", "_", "block$macrocall$1$macrocall$4", "__", "controlCondition", "_", "block$macrocall$1$macrocall$3$string$2", "_"]},
    {"name": "block$macrocall$1", "symbols": ["block$macrocall$1$macrocall$1", "newlines", "blockInside", "newlines", "block$macrocall$1$macrocall$3"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: false,
                controlStructure: data[0],
                statements: data[2]
            }
        }
        },
    {"name": "block", "symbols": ["block$macrocall$1"], "postprocess": id},
    {"name": "block$macrocall$5$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$5", "symbols": ["block$macrocall$5$string$1"]},
    {"name": "block$macrocall$6$string$1", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}, {"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$6", "symbols": ["block$macrocall$6$string$1"]},
    {"name": "block$macrocall$4$macrocall$2", "symbols": ["block$macrocall$5"]},
    {"name": "block$macrocall$4$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$4$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$4$macrocall$1", "symbols": ["block$macrocall$4$macrocall$1$string$1", "_", "block$macrocall$4$macrocall$2", "__", "controlCondition", "_", "block$macrocall$4$macrocall$1$string$2", "_"]},
    {"name": "block$macrocall$4$macrocall$4", "symbols": ["block$macrocall$6"]},
    {"name": "block$macrocall$4$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$4$macrocall$3$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$4$macrocall$3", "symbols": ["block$macrocall$4$macrocall$3$string$1", "_", "block$macrocall$4$macrocall$4", "__", "controlCondition", "_", "block$macrocall$4$macrocall$3$string$2", "_"]},
    {"name": "block$macrocall$4", "symbols": ["block$macrocall$4$macrocall$1", "newlines", "blockInside", "newlines", "block$macrocall$4$macrocall$3"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: false,
                controlStructure: data[0],
                statements: data[2]
            }
        }
        },
    {"name": "block", "symbols": ["block$macrocall$4"], "postprocess": id},
    {"name": "block", "symbols": ["controlBlockIfElse"], "postprocess": id},
    {"name": "blockInside", "symbols": ["blockInside_"], "postprocess": data => ({type: 'blockInside', statements: data[0]})},
    {"name": "blockInside_", "symbols": ["line"]},
    {"name": "blockInside_", "symbols": ["line", "newlines", "blockInside_"], "postprocess":  
        function (data) {
            let array = data[2]
            array.unshift(data[0])
            return array 
        } 
                                                    },
    {"name": "statement", "symbols": ["_", "statement_", "_"], "postprocess": data => data[1]},
    {"name": "statement_", "symbols": ["valueAssignement"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftCommand"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftComment"], "postprocess": id},
    {"name": "line", "symbols": ["_", "valueAssignement", "_"], "postprocess": data => data[1]},
    {"name": "line", "symbols": ["_", "minecraftCommand", "_"], "postprocess": data => data[1]},
    {"name": "line", "symbols": ["_", "minecraftComment", "_"], "postprocess": data => data[1]},
    {"name": "minecraftComment$ebnf$1", "symbols": [/./]},
    {"name": "minecraftComment$ebnf$1", "symbols": ["minecraftComment$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "minecraftComment", "symbols": [{"literal":"#"}, "minecraftComment$ebnf$1"], "postprocess": data => ({comment: data[0] + data[1].join(''), type: 'comment'})},
    {"name": "minecraftCommand", "symbols": ["word", "__", /[^\s=]/, "anything"], "postprocess": data => ({command: data[0], args: data[2] + data[3], type: 'command'})},
    {"name": "valueAssignement", "symbols": ["word", "_", {"literal":"="}, "_", "anything"], "postprocess": data => ({name: data[0], value: data[4], type: 'assignement'})}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
