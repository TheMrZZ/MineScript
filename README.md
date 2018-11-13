# MineScript
MineScript is a language and a compiler. 

### MineScript Language
MineScript is a language used to easily create complex Minecraft functions.
It gives you access to conditions, loops and variables inside your code. 
Using it, you can create:
- Datapacks easier to maintain and to understand;
- Complex animations in a few lines;
- Mod-like features;
- Everything you can do with vanilla functions, but easier and faster.

### MineScript compiler
To be understood by Minecraft, MineScript files have to be compiled into .mcfunction files. 
This is what this project does: it gives you a way to compile your .minescript files into working functions.

## Getting Started

## Features

### Minecraft commands and comments
Minescript is a superset of Minecraft functions. This means that any Minecraft function is a valid Minescript file.
You can therefore direcly use Minecraft commands and comments.

However, there is a little particularity: comments won't be added to compiled functions - they are only here to document the Minescript file. If you want your comment to be added inside the compiled function, just start it with ## instead of #.

E.g.: 
```
# Output "hey" to chat
say hey
```
Results in
```jinja
say hey
```
Here, the comment is not present in the result.

But the following Minescript:
```
## Output "hey" to chat
say hey
```

Results in
```
# Output "hey" to chat
say hey
```
As you can see, the comment is included in the result. It can be useful when you want your functions to be documented for other viewers.
Such comments are called **production comments**, as they are displayed in production files.

### Variables
#### Description
Minescript accepts custom variables. They allow you to:
 - Use the same value at different places
 - Use incrementing or decrementing counters
 - Make a clearer code
 - Keep your code non-repetitive.

#### Declaration and assignement
To declare a variable, just do `variable = *value*`.
For example:
```
item = "minecraft:diamond"
count = 32
```
A value can be a string (between simple quotes or double quotes), a number, an array... Any Javascript value is a correct Minescript value.

#### Operations
You can use Javascript operations on variables. Using the two variables from before:

```
giveCommand = "give @a " + item + " " + count
```

giveCommand will have the following value: 

```
"give @a minecraft:diamond 32"
```

#### Usage
You can use a variable inside commands. Do achieve that, use the variable inside double curly brackets: `{{ variable }}`.
For example,
```handlebars
item = "minecraft:diamond"
count = 32
give @a {{ item }} {{ count }}
```
Results in
```
give @a minecraft:diamond 32
```

You can use operations inside double curly brackets, and it will still work:
```handlebars
number = 7
say {{ number }} squared equals {{ number * number }}
```
Produces
```
say 7 squared equals 49
```

#### Warning
They are powerful, but there is one major thing to understand:  
**Variables are hard-written inside functions. They are not dynamic.**

This means that you can't assign the result of a command to a variable: variables are evaluated at **compilation time**, while commands give results at **run time**. We can't assign a unknown value to a variable.
Let's look at an example:
```handlebars
item = "minecraft:diamond"
count = 64

give @a {{ item }} {{ count }}
```
Will results in the following function:
```
give @a minecraft:diamond 64
```

There is nothing dynamic inside the function: the values are evaluated at the compilation.

### Conditional Statements
#### Description
Conditional statements allow you to perform some actions based on conditions.

### Loops
#### Description
Loops are used to generate several times the same content, but with some differences. Loops are very useful, as they allow you to do a lot in a few lines.

Minescript support these loops:
- While loops
- For loops

You can use any valid JavaScript loop as a Minescript loop.
This includes:
- Loops with assignement made inside the condition
- For loops based on counter: for (i=0; i < 100; i++)
- For loops iterating on a collection: for (number of [4, 8, 99])

Loops, just like conditional statements, are written inside `{% %}`, and end with a corresponding end tag: `{% endwhile %}` or `{% endfor %}`

#### For loops
For loops are the most useful loops in Minescript.
They allow you to go through a sequence of values in order, and to generate statements relative to these values.
For loops are written this way:
```jinja
{% for *condition* %}
# Block
{% endfor %}
```
Let's say you want to remove every stack of 64 items in a chest (coordinates 0 0 0). The easiest way would be:
```jinja
# 27 slots in a chest
numberOfSlots = 27
{% for (slot = 0; slot < numberOfSlots; slot++) %}
    data 
{% endfor %}
```

#### While loops
While loops are written this way:
```jinja
{% while *condition* %}
# Block
{% endwhile %}
```
While the condition is true, the inside block will be generated.
Let's say you want to generate every square numbers, until the square 100:
```
i = 0
{% while (i * i <= 100) %}
    say {{ i * i }}
    i += 1
{% endwhile %}
```
This will give the follwing result:
```mcfunction
say 0
say 1
say 4
say 9
say 16
say 25
say 36
say 49
say 64
say 81
say 100
```
And this could go as far as you want. While loops are useful when you don't know in advance when your loop will stop.
In Minescript, while loops are not as useful as for loops. The reason is simple: since they can't interact with the game itself, while loops can most of the time be replaced by for loops.

However, in some places, while loops make more sense than for loops, and you should use them when needed.
