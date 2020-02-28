# Invading Space

## Overview
Invading Space is a space invaders clone which was built for the purpose of AI exploitation using the genetic algorithm. Written in javascript using P5 libraries.
Visit it at [joelsmithdev.com/invading-space](https://joelsmithdev.com/invading-space/). This project was influenced by [Code Bullet's AI Projects](https://www.youtube.com/channel/UC0e3QhIYukixgh5VVpKHH9Q)

## Features
#### Modesxxx
Currently, there are two game modes

1. **User** is the traditional space invaders format, with rows of enemies descending on a lone ship controlled by the user. The user can move in all directions (as opposed to the classic) and firing is limited by a cooldown timer.
With each successive wave, the ship levels up and the enemies grow in number and increase their speeds.

|**User Mode**           |
| :---: |
|<img src="https://github.com/joelsmith2226/invading-space/blob/master/images/gifs/user.gif" width="600" height="280">|

2. **BasicAI** is an AI created from a simple algorithm (not generated using NN or genetic algorithms), but finding the closest enemy and targetting that enemy. It will also avoid imminent death

|**BasicAI**                |
| :---: |
|<img src="https://github.com/joelsmith2226/invading-space/blob/master/assets/gifs/basicAI.gif" width="600" height="280">|

## Future Features ##
- Advanced AI (using genetic algorithm)
- Mobile friendly (currently too much to process on mobile devices)
- Advanced enemies (move independent to the pack)
