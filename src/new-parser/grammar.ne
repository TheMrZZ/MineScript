value -> literalValue | numericalValue {% data => data[0]%}

literalValue -> variableName _ "=" _ quote literal quote _ {% data => ({name:data[0], value:data[5], type:"literal"}) %}
numericalValue -> variableName _ "=" _ [^"\s] anything _ {% data => ({name:data[0], value:data[4] + data[5], type:"numerical"}) %}

variableName -> [\w]:+ {% data => data[0].join('') %}

quote -> ["'] {% data => data[0] %}

_ -> null | __ {% d => null %}
__ -> w | __ w {% d => null %}
w -> [\s] {% d => null %}

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