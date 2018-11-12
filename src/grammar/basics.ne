# DONE

@{%
    const lexer = require('lexer.js')
%}

word -> [\w]:+ {% data => data[0].join('') %}

quote -> ["'] {% id %}

# On newlines. A newlineChar is either '\n' or '\r\n' (because of windows).
# Newlines are a succession of '\r' and '\n'. Homewever, a blank line full of blank characters can be 
# considere as a new line, so it has to be taken into account.
newlines -> newlines_ {% nuller %}              # newlines can simply be new lines
          | newlines_ __ newlines {% nuller %}  # or lines followed by a white space followed by lines
          
newlines_ -> newlineChar:+ {% () => 'blank' %}
newlineChar -> "\r" {% nuller %}
             | "\n" {% nuller %}

_ -> null | __ {% nuller %}
__ -> w | __ w {% nuller %}
w -> [ \t\v\f] {% nuller %}

something -> [^\s] .:* [^\s] {% data => data[0] + data[1].join('') + data[2] %}
           | [^\s] {% id %}
           
# Anything is either:
#   -> A list of characters not starting or ending by a whitespace
#   -> A single character (but not a whitespace)
#   -> Nothing
anything -> something {% id %}
          | null {% () => "" %}
