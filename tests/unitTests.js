const assert = require('assert')
const rewire = require('rewire')

const scriptParser = rewire('../src/parser/script-parser')

describe('script-parser', () => {
    const originalParse = scriptParser.__get__('parse')
    const options = {debug: true, logDebug: () => undefined, noFooter: true}
    const parse = string => originalParse(string, options).function.join('\n')

    describe('grammar', function () {
        it('should accept empty file', function () {
            assert.equal(parse(''), '')
        })

        it('should ignore whitespaces surrounding statements', function () {
            assert.equal(parse('say hi\n  \t  say hi   \nsay hi'), 'say hi\nsay hi\nsay hi')
        })

        it('should ignore whitespaces around operators', function () {
            assert.equal(parse(`a=5
            a   +=\t\t 5
            say hi
            a -=  8`), 'say hi')
        })

        it('should ignore whitespaces at start and end of file', function () {
            assert.equal(parse('\t \n \t \n say hi \t \n \t \n'), 'say hi')
        })

        it('should ignore whitespaces around {%', function () {
            assert.doesNotThrow(parse.bind(null, '{% \t\n if false %}\n{%endif %}'), SyntaxError)
        })

        it('should ignore whitespaces around %}', function () {
            assert.doesNotThrow(parse.bind(null, '{% if false%}{% endif   \t\t \n%}'), SyntaxError)
        })

        it('should ignore whitespaces around {{', function () {
            assert.doesNotThrow(parse.bind(null, 'a=0\nsay {{ \t\n a }}\nsay {{a }}'), SyntaxError)
        })

        it('should ignore whitespaces around }}', function () {
            assert.doesNotThrow(parse.bind(null, 'a=0\nsay {{ a  \n\t \n \t}}\nsay {{ a}}'), SyntaxError)
        })

        it('should accept while', function () {
            assert.doesNotThrow(parse.bind(null, '{%while false%}{%endwhile%}'), SyntaxError)
            assert.doesNotThrow(parse.bind(null, '{%while false%}\n\t\n{%endwhile%}'), SyntaxError)
        })

        it('should accept if', function () {
            assert.doesNotThrow(parse.bind(null, '{%if true%}{%endif%}'), SyntaxError)
            assert.doesNotThrow(parse.bind(null, '{%if true%}\n\t\n{%endif%}'), SyntaxError)
        })

        it('should accept if-else', function () {
            assert.doesNotThrow(parse.bind(null, '{%if false%}{%else%}{%endif%}'), SyntaxError)
            assert.doesNotThrow(parse.bind(null, '{%if false%}\n{%else%}\n{%endif%}'), SyntaxError)
        })

        it('should accept if-elif-else', function () {
            assert.doesNotThrow(parse.bind(null, '{%if false%}{%elif true%}{%else%}{%endif%}'), SyntaxError)
            assert.doesNotThrow(parse.bind(null, '{%if false%}\n{%elif true%}\n{%else%}\n{%endif%}'), SyntaxError)
        })

        it('should not accept wrong end statements: while endif, if endwhile', function () {
            assert.throws(parse.bind(null, '{%while true%}{%endif%}'), SyntaxError)
            assert.throws(parse.bind(null, '{%if true%}{%endwhile%}'), SyntaxError)
        })

        it('should not accept wrong intermediate statements: while elif, while else', function () {
            assert.throws(parse.bind(null, '{%while true%}{%else%}{%endwhile%}'), SyntaxError)
            assert.throws(parse.bind(null, '{%while true%}{%elif false%}{%endwhile%}'), SyntaxError)
        })
    })

    describe('parse', () => {
        it('should not change simple minecraft commands', function () {
            assert.equal(parse('say hi'), 'say hi')
        })

        it('should not render comments', function () {
            assert.equal(parse('#test\nsay hi\n#test'), 'say hi')
        })

        it('should not render variable assignment', function () {
            assert.equal(parse('a = 5\nsay hi\n  a = 58\n'), 'say hi')
        })

        it('should output variable value when used', function () {
            assert.equal(parse('a=5\nsay {{a}}'), 'say 5')
        })

        it('should handle lines with only a variable use', function () {
            assert.equal(parse('a = "say hi"\n{{ a }}'), 'say hi')
        })

        it('should handle lines starting with a variable use', function () {
            assert.equal(parse('a = "say"\n{{ a }} hi'), 'say hi')
            assert.equal(parse('cmd = "say"\nname="Player"\n{{cmd}} hi {{name}}'), 'say hi Player')
        })

        it('should consider single quotes as strings', function () {
            assert.equal(parse("arg='hi you'\nsay {{arg}}"), 'say hi you')
        })

        it('should consider double quotes as strings', function () {
            assert.equal(parse('arg="hi you"\nsay {{arg}}'), 'say hi you')
        })

        /* Here, we need to use double backslash, because when a file is read,
         * single backslash are escaped into double backslash automatically.
         * We need to manually mimic this behaviour for the tests to work
         */
        it('should unescape characters in string', function () {
            assert.equal(parse('arg="\\"hi\\nPlayer\\""\nsay {{arg}}'), 'say "hi\nPlayer"')
        })

        it('should not unescape characters in String.raw', function () {
            assert.equal(parse('arg=String.raw`"hi\\nPlayer"`\nsay {{arg}}'), 'say "hi\\nPlayer"')
        })

        it('should correctly parse while statements', function () {
            assert.equal(parse('i=0\n{% while i < 3 %}\ni += 1\nsay {{i}}\n{% endwhile %}'), 'say 1\nsay 2\nsay 3')
        })

        it('should correctly parse if statements', function () {
            assert.equal(parse('{% if 7 > 3 %}\nsay Correct!\n{%endif%}'), 'say Correct!')
            assert.equal(parse('{% if 3 > 7 %}\nsay Correct!\n{%endif%}'), '')
        })

        it('should correctly parse if-else statements', function () {
            assert.equal(parse('{% if 7 > 3 %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}'), 'say Greater')
            assert.equal(parse('{% if 3 > 7 %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}'), 'say Lower')
        })

        it('should correctly parse if-elif-else statements', function () {
            assert.equal(
                parse('{% if 3 > 3 %}\nsay Greater\n{%elif 3==3%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
                'say Equal'
            )
            assert.equal(
                parse('{% if 7 > 3 %}\nsay Greater\n{%elif 7==3%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
                'say Greater'
            )
            assert.equal(
                parse('{% if 3 > 7 %}\nsay Greater\n{%elif 3==7%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}'),
                'say Lower'
            )
        })
    })
})