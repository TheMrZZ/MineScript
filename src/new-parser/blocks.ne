@include "./basics.ne"

@{%
    const nuller = () => null
    const dataJoin = (data) => data.join('')
%}

main -> block {% id %}

# A control structure refers to the control of a program's flow: if, else, elif, for, while...
controlStructure[CONTROL_STATEMENT] -> "{%" _ $CONTROL_STATEMENT __ controlCondition _ "%}" _ 

controlCondition -> [^\s] .:* controlConditionEnd   {% data => data[0] + data[1].join('') + data[2] %}
                  | [^\s%] [^\s}]                   {% dataJoin %}
                  | [^\s]                           {% id %}

# A control condition can end by:
#   - never a whitespace
#   - Anything but a '}' 
#   - Anything but a '%' followed by a '}'
#   - An escaped % followed by a }: \%}
controlConditionEnd -> [^\s}]   {% dataJoin %}
                     | [^%] "}" {% dataJoin %}
                     | "\\%}"   {% id %}

# A control block is a set of continous lines, containing a group of statements.
# It is bounded by control stuctures (if -> endif, for -> endfor)
controlBlock[CONTROL_START, CONTROL_END] -> controlStructure[$CONTROL_START] newlines blockInside newlines controlStructure[$CONTROL_END] {%
    function (data) {
        return {
            type: 'block',
            isIfElse: false,
            controlStructure: data[0],
            statements: data[2]
        }
    }
%}

controlBlockIfElse -> controlStructure["if"] newlines blockInside newlines controlStructure["else"] newlines blockInside newlines controlStructure["endif"] {%
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
%}

block -> controlBlock["if", "endif"] {% id %}
       | controlBlock["for", "endfor"] {% id %}
       | controlBlockIfElse {% id %}

# The inside of a block is a group of statements, which can contain blocks too.
blockInside -> blockInside_ {% data => ({type: 'blockInside', statements: data[0]}) %}
blockInside_ -> line
              | line newlines blockInside_ {% 
                                                function (data) {
                                                    let array = data[2]
                                                    array.unshift(data[0])
                                                    return array 
                                                } 
                                            %}

# A statement is either a value assignement, a minecraft command or a comment
statement -> _ statement_ _ {% data => data[1] %}
statement_ -> valueAssignement {% id %}
            | minecraftCommand {% id %}
            | minecraftComment {% id %}


# A statement is either a value assignement, a minecraft command or a comment
line -> _ valueAssignement _ {% data => data[1] %}
      | _ minecraftCommand _ {% data => data[1] %}
      | _ minecraftComment _ {% data => data[1] %}

# A minecraft comment starts with a '#' and can be followed by absolutely anything.     
minecraftComment -> "#" .:+ {% data => ({comment: data[0] + data[1].join(''), type: 'comment'}) %}

# A minecraft command is a command name, not followed by an equal
minecraftCommand -> word __ [^\s=] anything {% data => ({command: data[0], args: data[2] + data[3], type: 'command'}) %}

# A value assignement is a variables name, followed by "=" and then by a value
valueAssignement -> word _ "=" _ anything {% data => ({name: data[0], value: data[4], type: 'assignement'}) %}
