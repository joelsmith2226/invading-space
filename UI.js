var portKey;
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
}

function resetButtons() {
   basicAIButton.remove();
   userButton.remove();
   portKey.remove();
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
