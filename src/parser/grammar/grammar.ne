@{%
    const lexer = require("./lexer")
%}

@lexer lexer

main -> "{%" _ %conditional __ %condition _ "%}" {% data => ({conditional: data[2], condition: data[4]}) %}

_ -> null | %ws
__ -> %ws