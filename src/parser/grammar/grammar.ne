@{%
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
%}

@lexer lexer

# The programs first "level" of code is a block of statements
main -> _nl:? statementBlock nl_:? {% data => data[1] %}

# A block is a block of statements surrounded by control statements
block -> controlStatement blockInside endControlStatement {% data => ({type: 'block', control: data[0], content: data[1], controlEnd: data[2]})%}

controlStatement -> "{%" ___ %conditional ws %condition ___ "%}"  {% data => {
    const conditional = data[2].value
    conditionStack.push(conditional)
    return {conditional: conditional, condition: data[4].value, line: data[2].line}
}%}

endControlStatement -> "{%" ___ %conditionalEnd ___ "%}" {% (data, loc, reject) => {
    const conditionalEnd = data[2].value
    const previousConditional = conditionStack.pop()

    if (conditionals[previousConditional] !== conditionalEnd) {
        throw new SyntaxError('Error: ' + previousConditional + ' does not match ' + conditionalEnd)
        return reject
    }
    
    return {conditional: conditionalEnd, condition: null, line: data[2].line}
}%}

# A block can be empty inside
blockInside -> _nl statementBlock nl_ {% data => data[1] %}
             | _nl_ {% () => [] %}
             | null {% () => [] %}

statementBlock -> null {% () => [] %}
                | statement # No %id%, because statementBlock returns an array of statements
                | statement nl statementBlock {% data => addToArray(data[2], data[0])%}

# A statement can be a block too!
statement -> _ statement_ _ {% data => data[1] %}
statement_ -> block {% id %}
            | initialExpression {% id %}
            | minecraftComment {% id %}
            | minecraftCommand {% id %}
            | valueAssignment {% id %}

# A minecraft comment starts with a '#' and can be followed by absolutely anything.     
minecraftComment -> "#" _ %comment {% data => ({type: 'comment', comment: data.join(''), line: data[2].line}) %}

# A value assignment is a variables name, followed by "=" and then by a value
valueAssignment -> %valueLeft _ %valueRight:? {% data => ({type: 'assignment', name: data[0].value, value: data[2] ? data[2].value : undefined, line: data[0].line}) %}

# An expression starting the line (has to evaluate to a minecraft command)
initialExpression -> %expression commandValue:? {% data => ({type: 'initialExpression', expression: data[0].value, value: data[1], line: data[0].line})%}

# A minecraft command
minecraftCommand -> %command commandValue {% data => ({type: 'command', command: data[0].value, value: data[1], line: data[0].line})%}

commandValue -> commandValue_ {% data => [data[0]] %}
              | commandValue_ commandValue {% data => addToArray(data[1], data[0]) %}

commandValue_ -> %literal  {% data => ({type: 'literal', data: data[0].value, line: data[0].line}) %}
               | %expression {% data => ({type: 'expression', data: data[0].value, line: data[0].line}) %}

# Optional whitespaces
_ -> null | %ws {% id%}

# Whitespaces
ws -> %ws {% id %}

# Optional newlines surrounded by optional whitespaces. Matches new lines, whitespaces & null
___ -> _ nl _ {% dataJoin %}
     | _ {% id %}

# New lines or blank lines
nl -> %newlines {% id %}
    | %newlines ws nl {% data => data[0] %}

# New lines surrounded with optional whitespaces
_nl_ -> _ nl _ {% dataJoin %}

# New lines preceded by optinal whitespaces 
_nl -> nl {% id %}
     | ws nl {% dataJoin %}

# A new line followed by optional whitespaces
nl_ -> nl {% id %}
     | nl ws {% dataJoin %}