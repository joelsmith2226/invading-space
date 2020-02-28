/*
 * Joel Smith
 * Invading Space
 * UI.js
 * This file tracks the UI of the application (buttons, links, backgrounds etc.)
 */

// GLOBALS
var portKey;
var left, right, fire;

/*
 * SetupButtons() initialises all of the buttons required for the application
 * This includes fire, left and right buttons for ship operation, mode selection buttons
 * and portfolio link button
 */
function setupButtons() {
   //Setup buttons
   basicAIButton = createButton("Basic AI");
   basicAIButton.position(20,10);
   basicAIButton.mousePressed(activateBasicAI);
   basicAIButton.class('start-btn');
   userButton = createButton("User");
   userButton.position(20,60);
   userButton.mousePressed(activateUser);
   userButton.class('start-btn');
   // background
   bgImg = loadImage('assets/Backgrounds/starfield.png');

   //Portfolio link
   portKey = createA("https://joelsmith2226.github.io", "Back to portfolio");
   portKey.class('start-btn link');
   portKey.position(windowWidth-200,10);
   fire = createButton("FIRE");
   fire.position(windowWidth/2 - 3/5 * fire.width, gameHeight + 20);
   fire.class('video-game-button fire');
   fire.mousePressed(firePressed);
   left = createButton('');
   left.html('<i class="fa fa-arrow-left"></i>')
   left.position(windowWidth/2 - left.width * 3 - 3/5 * fire.width, gameHeight + 20);
   left.class('video-game-button');
   right = createButton("");
   right.html('<i class="fa fa-arrow-right"></i>')
   right.position(windowWidth/2 + 1.8*right.width, gameHeight + 20);
   right.class('video-game-button');

   // function events
   left.mousePressed(moveLeft);
   right.mousePressed(moveRight);
   left.mouseReleased(haltMovement);
   right.mouseReleased(haltMovement);
}

/*
 * resetButtons() removes all buttons in the event of a display change event where
 * buttons' positions will need to be altered
 */
function resetButtons() {
   basicAIButton.remove();
   userButton.remove();
   portKey.remove();
   left.remove();
   right.remove();
   fire.remove();
   setupButtons();
}

/*
 * activateBasicAI() will shift into basicAI mode after the basicAI button has been pressed
 */
function activateBasicAI(){
   if (userActivated){
      userActivated = false;
      reset();
   }
}

/*
 * activateUser() will shift into user mode after the user button has been pressed
 */
function activateUser(){
   if (!userActivated){
      userActivated = true;
      reset();
   }
}

/*
 * moveLeft() will move the ship to the left when the left arrow is pressed
 */
function moveLeft(){
   ship.setMove(-1);
}

/*
 * moveRight() will move the ship to the right when the right arrow is pressed
 */
function moveRight(){
   ship.setMove(1);
}

/*
 * firePressed() will fire a bullet from the user when the fire button pressed
 */
function firePressed(){
   ship.fire();
}

/*
 * haltMovement() will set the movement to 0 when the movement arrows are released
 */
function haltMovement(){
   ship.setMove(0);
}
