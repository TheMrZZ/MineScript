const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const rewire = require('rewire')

const generateFile = rewire('../src/generator/file')

chai.use(chaiAsPromised)
chai.should()

const originalGenerate = generateFile.__get__('generate')
const options = {debug: true, logDebug: () => undefined, noFooter: true}
const generate = string => originalGenerate(string, options).then(f => f.statements.join('\n'))

describe('grammar', function () {
    it('should accept empty file', function () {
        return generate('').should.eventually.equal('')
    })

    it('should ignore whitespaces surrounding statements', function () {
        return generate('say hi\n  \t  say hi   \nsay hi').should.eventually.equal('say hi\nsay hi\nsay hi')
    })

    it('should ignore whitespaces around operators', function () {
        return generate(`a=5
            a   +=\t\t 5
            say hi
            a -=  8`).should.eventually.equal('say hi')
    })

    it('should ignore whitespaces at start and end of file', function () {
        return generate('\t \n \t \n say hi \t \n \t \n').should.eventually.equal('say hi')
    })

    it('should ignore whitespaces around {%', function () {
        return generate('{% \t\n if (false) %}\n{%endif %}').should.not.be.rejected
    })

    it('should ignore whitespaces around %}', function () {
        return generate('{% if (false)%}{% endif   \t\t \n%}').should.not.be.rejected
    })

    it('should ignore whitespaces before and after opening parenthesis in conditions', function () {
        return Promise.all([
            generate('{% if(false) %}{% endif %}').should.not.be.rejected,
            generate('{% if\n(\nfalse) %}{% endif %}').should.not.be.rejected,
            generate('{% if \t\n ( \n\t false) %}{% endif %}').should.not.be.rejected
        ])
    })

    it('should ignore whitespaces before and after opening parenthesis in conditions', function () {
        return Promise.all([
            generate('{% if(false) %}{% endif %}').should.not.be.rejected,
            generate('{% if(false\n)\n%}{% endif %}').should.not.be.rejected,
            generate('{% if(false \t\n ) \t\n %}{% endif %}').should.not.be.rejected
        ])
    })

    it('should refuse conditions not surrounded by parenthesis', function () {
        return Promise.all([
            generate('{% if true %}{% endif %}').should.be.rejectedWith(SyntaxError),
            generate('{% while true %}{% endif %}').should.be.rejectedWith(SyntaxError),
            generate('{% for i = 0; i < 1; i++ %}{% endif %}').should.be.rejectedWith(SyntaxError)
        ])
    })

    it('should ignore whitespaces around {{', function () {
        return generate('a=0\nsay {{ \t\n a }}\nsay {{a }}').should.not.be.rejected
    })

    it('should ignore whitespaces around }}', function () {
        return generate('a=0\nsay {{ a  \n\t \n \t}}\nsay {{ a}}').should.not.be.rejected
    })

    it('should accept while', function () {
        return Promise.all([
            generate('{%while (false)%}{%endwhile%}').should.not.be.rejected,
            generate('{%while (false)%}\n\t\n{%endwhile%}').should.not.be.rejected
        ])
    })

    it('should accept if', function () {
        return Promise.all([
            generate('{%if (true)%}{%endif%}').should.not.be.rejected,
            generate('{%if (true)%}\n\t\n{%endif%}').should.not.be.rejected
        ])
    })

    it('should accept if-else', function () {
        return Promise.all([
            generate('{%if (false)%}{%else%}{%endif%}').should.not.be.rejected,
            generate('{%if (false)%}\n{%else%}\n{%endif%}').should.not.be.rejected
        ])
    })

    it('should accept if-elif-else', function () {
        return Promise.all([
            generate('{%if (false)%}{%elif (true)%}{%else%}{%endif%}').should.not.be.rejected,
            generate('{%if (false)%}\n{%elif (true)%}\n{%else%}\n{%endif%}').should.not.be.rejected
        ])
    })

    it('should not accept wrong end statements: while endif, if endwhile', function () {
        return Promise.all([
            generate('{%while (true)%}{%endif%}').should.be.rejectedWith(SyntaxError),
            generate('{%if (true)%}{%endwhile%}').should.be.rejectedWith(SyntaxError)
        ])
    })

    it('should not accept wrong intermediate statements: while elif, while else', function () {
        return Promise.all([
            generate('{%while (true)%}{%else%}{%endwhile%}').should.be.rejectedWith(SyntaxError),
            generate('{%while (true)%}{%elif (false)%}{%endwhile%}').should.be.rejectedWith(SyntaxError)
        ])
    })

    it('should not accept end control tags without a starting control tag', function () {
        return Promise.all([
            generate('{%endwhile%}').should.be.rejectedWith(SyntaxError),
            generate('{%endif%}').should.be.rejectedWith(SyntaxError)
        ])
    })

    it('should not accept intermediate control tags without a starting control tag', function () {
        return Promise.all([
            generate('{%else%}').should.be.rejectedWith(SyntaxError),
            generate('{%elif true%}').should.be.rejectedWith(SyntaxError)
        ])
    })
})

describe('generateFile', () => {
    it('should not change simple minecraft commands', function () {
        return Promise.all([
            generate('say hi').should.eventually.equal('say hi'),
            generate('say hi').should.eventually.equal('say hi')
        ])
    })

    it('should not render comments', function () {
        return generate('#test\nsay hi\n#test').should.eventually.equal('say hi')
    })

    it('should render comments starting with ##', function () {
        return generate('## Outputs hey\nsay hey').should.eventually.equal('# Outputs hey\nsay hey')
    })

    it('should not render variable assignment', function () {
        return generate('a = 5\nsay hi\n  a = 58\n').should.eventually.equal('say hi')
    })

    it('should output variable value when used', function () {
        return generate('a=5\nsay {{a}}').should.eventually.equal('say 5')
    })

    it('should handle lines with only a variable use', function () {
        return Promise.all([
            generate('a = "say hi"\n{{ a }}').should.eventually.equal('say hi'),
            generate('a = "say"\n{{ a }} hi {{ a }}').should.eventually.equal('say hi say')
        ])
    })

    it('should handle lines starting with a variable use', function () {
        return Promise.all([
            generate('a = "say"\n{{ a }} hi').should.eventually.equal('say hi'),
            generate('cmd = "say"\nname="Player"\n{{cmd}} hi {{name}}').should.eventually.equal('say hi Player')
        ])
    })

    it('should consider single quotes as strings', function () {
        return generate("arg='hi you'\nsay {{arg}}").should.eventually.equal('say hi you')
    })

    it('should consider double quotes as strings', function () {
        return generate('arg="hi you"\nsay {{arg}}').should.eventually.equal('say hi you')
    })

    /* Here, we need to use double backslash, because when a file is read,
     * single backslash are escaped into double backslash automatically.
     * We need to manually mimic this behaviour for the tests to work
     */
    it('should unescape characters in string', function () {
        return generate('arg="\\"hi\\nPlayer\\""\nsay {{arg}}').should.eventually.equal('say "hi\nPlayer"')
    })

    it('should not unescape characters in String.raw', function () {
        return generate('arg=String.raw`"hi\\nPlayer"`\nsay {{arg}}').should.eventually.equal('say "hi\\nPlayer"')
    })

    it('should correctly generate while statements', function () {
        return Promise.all([
            generate('i=0\n{% while (i < 3) %}\ni += 1\nsay {{i}}\n{% endwhile %}').should.eventually.equal('say 1\nsay 2\nsay 3'),
            generate('i=0\n{% while (i < 3) %}\ni += 2\nsay {{i}}\n{% endwhile %}').should.eventually.equal('say 2\nsay 4'),
            generate('i=0\n{% while (i > 3) %}\ni += 1\nsay {{i}}\n{% endwhile %}').should.eventually.equal('')
        ])
    })

    it('should correctly generate if statements', function () {
        return Promise.all([
            generate('{% if (7 > 3) %}\nsay Correct!\n{%endif%}').should.eventually.equal('say Correct!'),
            generate('{% if (3 > 7) %}\nsay Correct!\n{%endif%}').should.eventually.equal('')
        ])
    })

    it('should correctly generate if-else statements', function () {
        return Promise.all([
            generate('{% if (7 > 3) %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}').should.eventually.equal('say Greater'),
            generate('{% if (3 > 7) %}\nsay Greater\n{%else%}\nsay Lower\n{%endif%}').should.eventually.equal('say Lower')
        ])
    })

    it('should correctly generate if-elif-else statements', function () {
        return Promise.all([
            generate('{% if (3 > 3) %}\nsay Greater\n{%elif (3==3)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}').should.eventually.equal('say Equal'),
            generate('{% if (7 > 3) %}\nsay Greater\n{%elif (7==3)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}').should.eventually.equal('say Greater'),
            generate('{% if (3 > 7) %}\nsay Greater\n{%elif (3==7)%}\nsay Equal\n{%else%}\nsay Lower\n{%endif%}').should.eventually.equal('say Lower')
        ])
    })

    it('should correctly generate for statements', function () {
        return Promise.all([
            generate('{% for (i = 0; i < 2; i++) %}\nsay {{ i }}\n{% endfor %}').should.eventually.equal('say 0\nsay 1'),
            generate('{% for (i = 0; i < 3; i++) %}\nsay {{ i }}\ni+=1\n{% endfor %}').should.eventually.equal('say 0\nsay 2'),
            generate('{% for (i = 0, j = 0; i < 2; i++, j += 2) %}\nsay {{i}} {{j}}\n{% endfor %}').should.eventually.equal('say 0 0\nsay 1 2'),
            generate('{% for (i of [8, 4, 4]) %}\nsay {{i}}\n{% endfor %}').should.eventually.equal('say 8\nsay 4\nsay 4')
        ])
    })
})
