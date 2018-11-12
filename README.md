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
```
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

`giveCommand = "give @a " + item + " " + count` 

giveCommand will have the following value: 

`"give @a minecraft:diamond 32"`

#### Usage
You can use a variable inside commands. Do achieve that, use the variable inside double curly brackets: `{{ variable }}`.
For example,
```
item = "minecraft:diamond"
count = 32
give @a {{ item }} {{ count }}
```
Results in
```
give @a minecraft:diamond 32
```

You can use operations inside double curly brackets, and it will still work:
```
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
```
item = "minecraft:diamond"
count = 64

give @a {{ item }} {{ count }}
```
Will results in the following function:
```
give @a minecraft:diamond 64
```

There is nothing dynamic inside the function: the values are evaluated at the compilation.

### Loops
