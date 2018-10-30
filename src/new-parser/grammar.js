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
    {"name": "controlCondition$ebnf$1", "symbols": []},
    {"name": "controlCondition$ebnf$1", "symbols": ["controlCondition$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "controlCondition", "symbols": [/[^\s]/, "controlCondition$ebnf$1", "controlConditionEnd"], "postprocess": data => data[0] + data[1].join('') + data[2]},
    {"name": "controlCondition", "symbols": [/[^\s%]/, /[^\s}]/], "postprocess": dataJoin},
    {"name": "controlCondition", "symbols": [/[^\s]/], "postprocess": id},
    {"name": "controlConditionEnd", "symbols": [/[^\s}]/], "postprocess": dataJoin},
    {"name": "controlConditionEnd", "symbols": [/[^%]/, {"literal":"}"}], "postprocess": dataJoin},
    {"name": "controlConditionEnd$string$1", "symbols": [{"literal":"\\"}, {"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlConditionEnd", "symbols": ["controlConditionEnd$string$1"], "postprocess": id},
    {"name": "statement", "symbols": ["_", "statement_", "_"], "postprocess": data => data[1]},
    {"name": "statement_", "symbols": ["valueAssignement"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftCommand"], "postprocess": id},
    {"name": "statement_", "symbols": ["minecraftComment"], "postprocess": id},
    {"name": "minecraftComment$ebnf$1", "symbols": [/./]},
    {"name": "minecraftComment$ebnf$1", "symbols": ["minecraftComment$ebnf$1", /./], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "minecraftComment", "symbols": [{"literal":"#"}, "minecraftComment$ebnf$1"], "postprocess": data => ({comment: data[0] + data[1].join(''), type: 'comment'})},
    {"name": "minecraftCommand", "symbols": ["word", "__", /[^\s=]/, "anything"], "postprocess": data => ({command: data[0], args: data[2] + data[3], type: 'command'})},
    {"name": "valueAssignement", "symbols": ["word", "_", {"literal":"="}, "_", "anything"], "postprocess": data => ({name: data[0], value: data[4], type: 'assignement'})},
    {"name": "controlBlockIfElse$macrocall$2$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$2", "symbols": ["controlBlockIfElse$macrocall$2$string$1"]},
    {"name": "controlBlockIfElse$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$1", "symbols": ["_", "controlBlockIfElse$macrocall$1$string$1", "_", "controlBlockIfElse$macrocall$2", "__", "controlCondition", "_", "controlBlockIfElse$macrocall$1$string$2", "_"], "postprocess": data => ({controlStatement: data[3].join(), controlCondition: data[5]})},
    {"name": "controlBlockIfElse$macrocall$4$string$1", "symbols": [{"literal":"e"}, {"literal":"l"}, {"literal":"s"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$4", "symbols": ["controlBlockIfElse$macrocall$4$string$1"]},
    {"name": "controlBlockIfElse$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$3$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$3", "symbols": ["_", "controlBlockIfElse$macrocall$3$string$1", "_", "controlBlockIfElse$macrocall$4", "__", "controlCondition", "_", "controlBlockIfElse$macrocall$3$string$2", "_"], "postprocess": data => ({controlStatement: data[3].join(), controlCondition: data[5]})},
    {"name": "controlBlockIfElse$macrocall$6$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$6", "symbols": ["controlBlockIfElse$macrocall$6$string$1"]},
    {"name": "controlBlockIfElse$macrocall$5$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$5$string$2", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$5$string$3", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "controlBlockIfElse$macrocall$5", "symbols": ["_", "controlBlockIfElse$macrocall$5$string$1", "_", "controlBlockIfElse$macrocall$5$string$2", "controlBlockIfElse$macrocall$6", "_", "controlBlockIfElse$macrocall$5$string$3", "_"], "postprocess": data => ({controlStatement: data[3] + data[4].join()})},
    {"name": "controlBlockIfElse", "symbols": ["controlBlockIfElse$macrocall$1", "newlines", "blockContent", "newlines", "controlBlockIfElse$macrocall$3", "newlines", "blockContent", "newlines", "controlBlockIfElse$macrocall$5"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: true,
                if: {
                    controlStructure: data[0],
                    content: data[2]
                },
                else: {
                    controlStructure: data[4],
                    content: data[6]
                }
            }
        }
        },
    {"name": "block$macrocall$2$string$1", "symbols": [{"literal":"i"}, {"literal":"f"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$2", "symbols": ["block$macrocall$2$string$1"]},
    {"name": "block$macrocall$1$macrocall$2", "symbols": ["block$macrocall$2"]},
    {"name": "block$macrocall$1$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$1", "symbols": ["_", "block$macrocall$1$macrocall$1$string$1", "_", "block$macrocall$1$macrocall$2", "__", "controlCondition", "_", "block$macrocall$1$macrocall$1$string$2", "_"], "postprocess": data => ({controlStatement: data[3].join(), controlCondition: data[5]})},
    {"name": "block$macrocall$1$macrocall$4", "symbols": ["block$macrocall$2"]},
    {"name": "block$macrocall$1$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$3$string$2", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$3$string$3", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$1$macrocall$3", "symbols": ["_", "block$macrocall$1$macrocall$3$string$1", "_", "block$macrocall$1$macrocall$3$string$2", "block$macrocall$1$macrocall$4", "_", "block$macrocall$1$macrocall$3$string$3", "_"], "postprocess": data => ({controlStatement: data[3] + data[4].join()})},
    {"name": "block$macrocall$1", "symbols": ["block$macrocall$1$macrocall$1", "newlines", "blockContent", "newlines", "block$macrocall$1$macrocall$3"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: false,
                controlStructure: data[0],
                content: data[2]
            }
        }
        },
    {"name": "block", "symbols": ["block$macrocall$1"], "postprocess": id},
    {"name": "block$macrocall$4$string$1", "symbols": [{"literal":"f"}, {"literal":"o"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$4", "symbols": ["block$macrocall$4$string$1"]},
    {"name": "block$macrocall$3$macrocall$2", "symbols": ["block$macrocall$4"]},
    {"name": "block$macrocall$3$macrocall$1$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3$macrocall$1$string$2", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3$macrocall$1", "symbols": ["_", "block$macrocall$3$macrocall$1$string$1", "_", "block$macrocall$3$macrocall$2", "__", "controlCondition", "_", "block$macrocall$3$macrocall$1$string$2", "_"], "postprocess": data => ({controlStatement: data[3].join(), controlCondition: data[5]})},
    {"name": "block$macrocall$3$macrocall$4", "symbols": ["block$macrocall$4"]},
    {"name": "block$macrocall$3$macrocall$3$string$1", "symbols": [{"literal":"{"}, {"literal":"%"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3$macrocall$3$string$2", "symbols": [{"literal":"e"}, {"literal":"n"}, {"literal":"d"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3$macrocall$3$string$3", "symbols": [{"literal":"%"}, {"literal":"}"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "block$macrocall$3$macrocall$3", "symbols": ["_", "block$macrocall$3$macrocall$3$string$1", "_", "block$macrocall$3$macrocall$3$string$2", "block$macrocall$3$macrocall$4", "_", "block$macrocall$3$macrocall$3$string$3", "_"], "postprocess": data => ({controlStatement: data[3] + data[4].join()})},
    {"name": "block$macrocall$3", "symbols": ["block$macrocall$3$macrocall$1", "newlines", "blockContent", "newlines", "block$macrocall$3$macrocall$3"], "postprocess": 
        function (data) {
            return {
                type: 'block',
                isIfElse: false,
                controlStructure: data[0],
                content: data[2]
            }
        }
        },
    {"name": "block", "symbols": ["block$macrocall$3"], "postprocess": id},
    {"name": "block", "symbols": ["controlBlockIfElse"], "postprocess": id},
    {"name": "blockContent", "symbols": ["blockContent_"], "postprocess": id},
    {"name": "blockContent_", "symbols": ["basicBlock"]},
    {"name": "blockContent_", "symbols": ["basicBlock", "newlines", "blockContent_"], "postprocess":  
            function (data) {
            let array = data[2]
            array.unshift(data[0])
            return array 
        } 
        },
    {"name": "basicBlock", "symbols": ["block"], "postprocess": id},
    {"name": "basicBlock", "symbols": ["statement"], "postprocess": id},
    {"name": "main", "symbols": ["block"], "postprocess": id}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
