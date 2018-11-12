const assert = require('assert')
const rewire = require('rewire')

const generateFile = rewire('../src/generator/file')

const originalGenerate = generateFile.__get__('generate')
const options = {debug: true, logDebug: () => undefined, noFooter: true}
const generate = string => originalGenerate(string, options).function.join('\n')

describe('grammar', function () {
    it('should accept empty file', function () {
        assert.equal(generate(''), '')
    })

    it('should ignore whitespaces surrounding statements', function () {
        assert.equal(generate('say hi\n  \t  say hi   \nsay hi'), 'say hi\nsay hi\nsay hi')
    })

    it('should ignore whitespaces around operators', function () {
        assert.equal(generate(`a=5
            a   +=\t\t 5
            say hi
            a -=  8`), 'say hi')
    })

    it('should ignore whitespaces at start and end of file', function () {
        assert.equal(generate('\t \n \t \n say hi \t \n \t \n'), 'say hi')
    })

    it('should ignore whitespaces around {%', function () {
        assert.doesNotThrow(generate.bind(null, '{% \t\n if (false) %}\n{%endif %}'), SyntaxError)
    })

    it('should ignore whitespaces around %}', function () {
        assert.doesNotThrow(generate.bind(null, '{% if (false)%}{% endif   \t\t \n%}'), SyntaxError)
    })

    it('should ignore whitespaces before and after opening parenthesis in conditions', function () {
        assert.doesNotThrow(generate.bind(null, '{% if(false) %}{% endif %}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{% if\n(\nfalse) %}{% endif %}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{% if \t\n ( \n\t false) %}{% endif %}'), SyntaxError)
    })

    it('should ignore whitespaces before and after opening parenthesis in conditions', function () {
        assert.doesNotThrow(generate.bind(null, '{% if(false) %}{% endif %}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{% if(false\n)\n%}{% endif %}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{% if(false \t\n ) \t\n %}{% endif %}'), SyntaxError)
    })

    it('should refuse conditions not surrounded by parenthesis', function () {
        assert.throws(generate.bind(null, '{% if true %}{% endif %}'), SyntaxError)
        assert.throws(generate.bind(null, '{% while true %}{% endif %}'), SyntaxError)
        assert.throws(generate.bind(null, '{% for i = 0; i < 1; i++ %}{% endif %}'), SyntaxError)
    })

    it('should ignore whitespaces around {{', function () {
        assert.doesNotThrow(generate.bind(null, 'a=0\nsay {{ \t\n a }}\nsay {{a }}'), SyntaxError)
    })

    it('should ignore whitespaces around }}', function () {
        assert.doesNotThrow(generate.bind(null, 'a=0\nsay {{ a  \n\t \n \t}}\nsay {{ a}}'), SyntaxError)
    })

    it('should accept while', function () {
        assert.doesNotThrow(generate.bind(null, '{%while (false)%}{%endwhile%}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{%while (false)%}\n\t\n{%endwhile%}'), SyntaxError)
    })

    it('should accept if', function () {
        assert.doesNotThrow(generate.bind(null, '{%if (true)%}{%endif%}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{%if (true)%}\n\t\n{%endif%}'), SyntaxError)
    })

    it('should accept if-else', function () {
        assert.doesNotThrow(generate.bind(null, '{%if (false)%}{%else%}{%endif%}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{%if (false)%}\n{%else%}\n{%endif%}'), SyntaxError)
    })

    it('should accept if-elif-else', function () {
        assert.doesNotThrow(generate.bind(null, '{%if (false)%}{%elif (true)%}{%else%}{%endif%}'), SyntaxError)
        assert.doesNotThrow(generate.bind(null, '{%if (false)%}\n{%elif (true)%}\n{%else%}\n{%endif%}'), SyntaxError)
    })

    it('should not accept wrong end statements: while endif, if endwhile', function () {
        assert.throws(generate.bind(null, '{%while (true)%}{%endif%}'), SyntaxError)
        assert.throws(generate.bind(null, '{%if (true)%}{%endwhile%}'), SyntaxError)
    })

    it('should not accept wrong intermediate statements: while elif, while else', function () {
        assert.throws(generate.bind(null, '{%while (true)%}{%else%}{%endwhile%}'), SyntaxError)
        assert.throws(generate.bind(null, '{%while (true)%}{%elif (false)%}{%endwhile%}'), SyntaxError)
    })

    it('should not accept end control tags without a starting control tag', function () {
        assert.throws(generate.bind(null, '{%endwhile%}'), SyntaxError)
        assert.throws(generate.bind(null, '{%endif%}'), SyntaxError)
    })

    it('should not accept intermediate control tags without a starting control tag', function () {
        assert.throws(generate.bind(null, '{%else%}'), SyntaxError)
        assert.throws(generate.bind(null, '{%elif true%}'), SyntaxError)
    })
})

describe('generateFile', () => {
    it('should not change simple minecraft commands', function () {
        assert.equal(generate('say hi'), 'say hi')
    })

    it('should not render comments', function () {
        assert.equal(generate('#test\nsay hi\n#test'), 'say hi')
    })

    it('should render comments starting with ##', function () {
        assert.equal(generate('## Outputs hey\nsay hey'), '# Outputs hey\nsay hey')
    })

    it('should not render variable assignment', function () {
        assert.equal(generate('a = 5\nsay hi\n  a = 58\n'), 'say hi')
    })

    it('should output variable value when used', function () {
        assert.equal(generate('a=5\nsay {{a}}'), 'say 5')
    })

    it('should handle lines with only a variable use', function () {
        assert.equal(generate('a = "say hi"\n{{ a }}'), 'say hi')
        assert.equal(generate('a = "say"\n{{ a }} hi {{ a }}'), 'say hi say')
    })

    it('should handle lines starting with a variable use', function () {
        assert.equal(generate('a = "say"\n{{ a }} hi'), 'say hi')
        assert.equal(generate('cmd = "say"\nname="Player"\n{{cmd}} hi {{name}}'), 'say hi Player')
    })

    it('should consider single quotes as strings', function () {
        assert.equal(generate("arg='hi you'\nsay {{arg}}"), 'say hi you')
    })

    it('should consider double quotes as strings', function () {
        assert.equal(generate('arg="hi you"\nsay {{arg}}'), 'say hi you')
    })

    /* Here, we need to use double backslash, because when a file is read,
     * single backslash are escaped into double backslash automatically.
     * We need to manually mimic this behaviour for the tests to work
     */
    it('should unescape characters in string', function () {
        assert.equal(generate('arg="\\"hi\\nPlayer\\""\nsay {{arg}}'), 'say "hi\nPlayer"')
    })

    it('should not unescape characters in String.raw', function () {
        assert.equal(generate('arg=String.raw`"hi\\nPlayer"`\nsay {{arg}}'), 'say "hi\\nPlayer"')
    })

    it('should correctly generate while statements', function () {
        assert.equal(generate('i=0\n{% while (i < 3) %}\ni += 1\nsay {{i}}\n{% endwhile %}'), 'say 1\nsay 2\nsay 3')
        assert.equal(generate('i=0\n{% while (i < 3) %}\ni += 2\nsay {{i}}\n{% endwhile %}'), 'say 2\nsay 4')
        assert.equal(generate('i=0\n{% while (i > 3) %}\ni += 1\nsay {{i}}\n{% endwhile %}'), '')
    })

    it('should correctly generate if statements', function () {
        assert.equal(generate('{% if (7 > 3) %}\nsay Correct!\n{%endif%}'), 'say Correct!')
        assert.equal(generate('{% if (3 > 7) %}\nsay Correct!\n{%endif%}'), '')
    })

    it('should correctly generate if-else statements', function () {
        assert.equal(generate('{% if (7 > 3) %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}'), 'say Greater')
        assert.equal(generate('{% if (3 > 7) %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}'), 'say Lower')
    })

    it('should correctly generate if-elif-else statements', function () {
        assert.equal(
            generate('{% if (3 > 3) %}\nsay Greater\n{%elif (3==3)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
            'say Equal'
        )
        assert.equal(
            generate('{% if (7 > 3) %}\nsay Greater\n{%elif (7==3)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
            'say Greater'
        )
        assert.equal(
            generate('{% if (3 > 7) %}\nsay Greater\n{%elif (3==7)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
            'say Lower'
        )
    })

    it('should correctly generate for statements', function () {
        assert.equal(generate('{% for (i = 0; i < 2; i++) %}\nsay {{ i }}\n{% endfor %}'), 'say 0\nsay 1')
        assert.equal(generate('{% for (i = 0; i < 3; i++) %}\nsay {{ i }}\ni+=1\n{% endfor %}'), 'say 0\nsay 2')
        assert.equal(generate('{% for (i = 0, j = 0; i < 2; i++, j += 2) %}\nsay {{i}} {{j}}\n{% endfor %}'), 'say 0 0\nsay 1 2')
        assert.equal(generate('{% for (i of [8, 4, 4]) %}\nsay {{i}}\n{% endfor %}'), 'say 8\nsay 4\nsay 4')
    })
})
