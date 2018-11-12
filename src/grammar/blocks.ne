@include "./basics.ne"
@include "./control-structures.ne"
@include "./basic-statements.ne"

@{%
    const nuller = () => function () {return null}
    const dataJoin = (data) => data.join('')
%}

# A control block is a set of continous lines, containing a group of statements.
# It is bounded by control stuctures (if -> endif, for -> endfor)
controlBlock[CONTROL_TYPE] -> controlStructure[$CONTROL_TYPE] newlines blockContent newlines controlStructureEnd[$CONTROL_TYPE] {%
    function (data) {
        return {
            type: 'block',
            isIfElse: false,
            controlType: data[0].type,
            controlArgument: data[0].argument,
            content: data[2]
        }
    }
%}

controlBlockIfElse -> controlStructure["if"] newlines blockContent newlines controlStructure["else"] newlines blockContent newlines controlStructureEnd["if"] {%
    function (data) {
        return {
            type: 'block',
            isIfElse: true,
            if: {
                controlType: data[0].type,
                controlArgument: data[0].argument,
                content: data[2]
            },
            else: {
                controlType: data[4].type,
                controlArgument: data[4].argument,
                content: data[6]
            }
        }
    }
%}

block -> controlBlock["if"] {% id %}
       | controlBlock["while"] {% id %}
       | controlBlockIfElse {% id %}


# The inside of a block is a group of statements, which can contain blocks too.
blockContent -> basicBlock # No {% id %}, because blockContent_ is an array of statements
              | basicBlock newlines blockContent {% 
                                                    function (data) {
                                                        let array = data[2]
                                                        array.unshift(data[0])
                                                        return array 
                                                    } 
                                                    %}

# A basic can be a single basic statement, or a block of other statements
basicBlock -> block          {% id %} 
            | basicStatement {% id %}