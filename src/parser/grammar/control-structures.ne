@{%
    const lexer = require('lexer')
%}
@lexer lexer

@include "basics.ne"

# A control structure refers to the control of a program's flow: if, else, elif, for, while...
controlStructure[CONTROL_TYPE] -> _ "{%" _ $CONTROL_TYPE __ controlCondition _ "%}" _ {% data => ({type: data[3].join(), argument : data[5]})%}
controlStructureEnd[CONTROL_TYPE] -> _ "{%" _ "end" $CONTROL_TYPE _ "%}" _ {% data => ({type: data[3] + data[4].join()})%}

controlCondition -> [^\s] .:* controlConditionEnd   {% data => data[0] + data[1].join('') + data[2] %}
                  | [^\s%] [^\s}]                   {% dataJoin %}
                  | [^\s]                           {% id %}

# Old lexer
@{%
    const lexer = require('./lexer')
    const nuller = () => null
    dataJoin = data => data.join('')
%}
@lexer lexer

# A control structure refers to the control of a program's flow: if, else, elif, for, while...
controlStructure[CONTROL_TYPE] -> _ "{%" _ $CONTROL_TYPE __ anything _ "%}" _ {% data => ({type: data[3].join(), argument : data[5]})%}
controlStructureEnd[CONTROL_TYPE] -> _ "{%" _ "end" $CONTROL_TYPE _ "%}" _ {% data => ({type: data[3] + data[4].join()})%}

main -> controlStructure["if"] {% data => {const colors = require('colors'); console.log('DATA:'.green, JSON.stringify(data[0]).green); return data[0]; } %}

controlCondition -> [^\s]   {% data => data[0] + data[1].join('') + data[2] %}
                  | [^\s%] [^\s}]                   {% dataJoin %}
                  | [^\s]                           {% id %}


# A basic statement is either a value assignment, a minecraft command or a comment
basicStatement -> _ basicStatement_ _ {% data => data[1] %}
basicStatement_ -> valueAssignment {% id %}
                 | minecraftCommand {% id %}
                 | minecraftComment {% id %}

# A minecraft comment starts with a '#' and can be followed by absolutely anything.     
minecraftComment -> "#" anything {% data => ({comment: data[0] + data[1].join(''), type: 'comment'}) %}

# A minecraft command is a command name, not followed by an equal
minecraftCommand -> %word __ %minecraftCommandArg {% data => ({command: data[0], args: data[2].join(''), type: 'command'}) %}

# A value assignment is a variables name, followed by "=" and then by a value
valueAssignment -> %word _ "=" _ anything {% data => ({name: data[0], value: data[4], type: 'assignment'}) %}

anything -> null | %something {% id %}

_ -> %ws:? {% nuller %}
__ -> %ws