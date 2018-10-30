@include "./basics.ne"

# A basic statement is either a value assignement, a minecraft command or a comment
basicStatement -> _ basicStatement_ _ {% data => data[1] %}
basicStatement_ -> valueAssignement {% id %}
            | minecraftCommand {% id %}
            | minecraftComment {% id %}

# A minecraft comment starts with a '#' and can be followed by absolutely anything.     
minecraftComment -> "#" .:+ {% data => ({comment: data[0] + data[1].join(''), type: 'comment'}) %}

# A minecraft command is a command name, not followed by an equal
minecraftCommand -> word __ [^\s=] anything {% data => ({command: data[0], args: data[2] + data[3], type: 'command'}) %}

# A value assignement is a variables name, followed by "=" and then by a value
valueAssignement -> word _ "=" _ anything {% data => ({name: data[0], value: data[4], type: 'assignement'}) %}