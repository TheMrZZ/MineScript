# Author: TheMrZZ - u/TheMrZZ0
execute if score total items matches 64.. run give @s minecraft:diamond 64
execute if score total items matches 64.. run scoreboard players remove total items 64
execute if score total items matches 15.. run give @s minecraft:diamond 15
execute if score total items matches 15.. run scoreboard players remove total items 15
execute if score total items matches 1.. run give @s minecraft:diamond 1
execute if score total items matches 1.. run scoreboard players remove total items 1
execute if score total items matches 1.. run function cheststealer:give
# Created with MineScript: https://github.com/TheMrZZ/MineScript