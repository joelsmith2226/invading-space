var portKey;
var left, right, fire;
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

   left.mousePressed(moveLeft);
   right.mousePressed(moveRight);
   left.mouseReleased(haltMovement);
   right.mouseReleased(haltMovement);
}

function resetButtons() {
   basicAIButton.remove();
   userButton.remove();
   portKey.remove();
   left.remove();
   right.remove();
   fire.remove();
   setupButtons();
}


function activateBasicAI(){
   if (userActivated){
      userActivated = false;
      reset();
   }
}

function activateUser(){
   if (!userActivated){
      userActivated = true;
      reset();
   }
}

function moveLeft(){
   ship.setMove(-1);
}

function moveRight(){
   ship.setMove(1);
}

function firePressed(){
   ship.fire();
}

function haltMovement(){
   ship.setMove(0);
}
