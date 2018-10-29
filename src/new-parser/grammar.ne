# The inside of a block is a group of statements, which can contain blocks too.
blockInside -> null | blockInside_ {% id %}
blockInside_ -> line newline line {% data => {return [data[0], data[2]]} %}

# A line is either a value assignement, or a minecraft command
line -> valueAssignement {% id %}
      | minecraftCommand {% id %}

# A minecraft command is a command name, not followed by an equal
minecraftCommand -> word __ [^\s=] anything _ {% data => ({command: data[0], args: data[2] + data[3], type: 'command'}) %}

# A value assignement is a variables name, followed by "=" and then by a value
valueAssignement -> word _ "=" _ anything _ {% data => ({name: data[0], value: data[4], type: 'assignement'}) %}

#literalValue -> word _ "=" _ quote literal quote _ {% data => ({name:data[0], value:data[5], type:"literal"}) %}
#numericalValue -> word _ "=" _ [^"\s] anything _ {% data => ({name:data[0], value:data[4] + data[5], type:"numerical"}) %}

word -> [\w]:+ {% data => data[0].join('') %}

quote -> ["'] {% id %}

_ -> null | __ {% () => null %}
__ -> w | __ w {% () => null %}
w -> [\s] {% () => null %}

newline -> _ newline_:+ {% () => null %}
newline_ -> "\r" "\n" {% () => null %}
          | "\r" {% () => null %}
          | "\n" {% () => null %}

# A literal is the content of a string. It can be:
#   -> A list of characters not ending by a quote
#   -> A list of characters ending by an escaped quote
#   -> Any single character
#   -> Nothing
literal -> .:+ [^\"] {% data => data[0].join('') + data[1]%}
         | .:+ "\\\"" {% data => data[0].join('') + data[1]%}
         | .
         | null

# Anything is either:
#   -> A list of characters not starting or ending by a whitespace
#   -> A single character (but not a whitespace)
#   -> Nothing
anything -> [^\s] .:* [^\s] {% data => data[0] + data[1].join('') + data[2] %}
          | [^\s]
          | null