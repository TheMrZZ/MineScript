@include "basics.ne"

# A control structure refers to the control of a program's flow: if, else, elif, for, while...
controlStructure[CONTROL_TYPE] -> _ "{%" _ $CONTROL_TYPE __ controlCondition _ "%}" _ {% data => ({type: data[3].join(), argument : data[5]})%}
controlStructureEnd[CONTROL_TYPE] -> _ "{%" _ "end" $CONTROL_TYPE _ "%}" _ {% data => ({type: data[3] + data[4].join()})%}

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