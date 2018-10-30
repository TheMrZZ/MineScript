@include "./basics.ne"
@include "./control-structures.ne"
@include "./basic-statements.ne"

@{%
    const nuller = () => null
    const dataJoin = (data) => data.join('')
%}

# A control block is a set of continous lines, containing a group of statements.
# It is bounded by control stuctures (if -> endif, for -> endfor)
controlBlock[CONTROL_STATEMENT] -> controlStructure[$CONTROL_STATEMENT] newlines blockContent newlines controlStructureEnd[$CONTROL_STATEMENT] {%
    function (data) {
        return {
            type: 'block',
            isIfElse: false,
            controlStructure: data[0],
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
                controlStructure: data[0],
                content: data[2]
            },
            else: {
                controlStructure: data[4],
                content: data[6]
            }
        }
    }
%}

block -> controlBlock["if"] {% id %}
       | controlBlock["for"] {% id %}
       | controlBlockIfElse {% id %}


# The inside of a block is a group of statements, which can contain blocks too.
blockContent -> blockContent_ {% id %}
blockContent_ -> basicBlock
              | basicBlock newlines blockContent_ {% 
                                                    function (data) {
                                                    let array = data[2]
                                                    array.unshift(data[0])
                                                    return array 
                                                } 
                                                %}

# A statement can be a single basic statement, or a block of other statements
basicBlock -> block     {% id %} 
            | basicStatement {% id %}