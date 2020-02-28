/*
 * Joel Smith
 * Invading Space
 * sketch.js
 * This is the main file executed for displaying object information for the web
 * application. It houses the canvas and the corresponding child objects that
 * sits on top of the canvas.
 */

// Global Objects
var ship, shipAnimation, enemyAnimation, bgImg;
var enemies = [];
var bullets = [];
var enemyBullets = [];

// Global dimensions
var gameHeight, gameWidth, realWidth, realHeight;

// Global vars
var enemyRows = 4;
var enemiesPerRow = 5;
var userActivated = true;
var keyFlag = false;
var specialEnemy;
var basicAIButton, userButton;
var shotCooldownTimer = 0;
var highScore = 0;

// Constants
const SHOT_COOLDOWN = 40;
const MAX_ENEMIES = 9;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 480;

/* preload() takes animations required within website to be loaded prior
 * to displaying for smooth operation
 */
function preload() {
   shipAnimation = loadAnimation('assets/Ship/f1.png','assets/Ship/f2.png',
                              'assets/Ship/f3.png','assets/Ship/f4.png');
   enemyAnimation = loadAnimation('assets/Enemy/Example/e_f1.png','assets/Enemy/Example/e_f2.png',
                              'assets/Enemy/Example/e_f3.png','assets/Enemy/Example/e_f4.png');
}

/*
 * setup() is the initialisation function for the canvas, UI, Ships and Enemies. This is
 * called at the start of the program
 */
function setup() {
   setupCanvas();
   if (userActivated){
      ship = new Ship();
   } else {
      ship = new BasicAI();
   }
   for (var i = 0; i < enemiesPerRow; i++){
      for (var j = 0; j < enemyRows; j++){
         enemies.push(new Enemy(i*30 + 30, j*30 + 30, ship.level));
      }
   }
   setupButtons();

}

/*
 * setupCanvas() is responsible for creating the canvas on which to draw all objects
 * as well as define display boundaries
*/
function setupCanvas(){
   createCanvas(windowWidth, windowHeight);

   //In a phone
   if (windowHeight > windowWidth){
      gameHeight = windowHeight * 2/5;
      gameWidth = windowWidth * 1/2;

   // Desktop
   } else if (windowHeight > DEFAULT_HEIGHT && windowWidth > DEFAULT_WIDTH) {
      gameHeight = DEFAULT_HEIGHT;
      gameWidth = DEFAULT_WIDTH;

   // Educated guess
   } else {
      gameHeight = windowHeight * 2/3;
      gameWidth = windowWidth * 1/3;
   }

   realWidth = windowWidth;
   realHeight = windowHeight;
}

/*
 * draw() is the main function. It is called 60 times per second. All
 * transformations (translate, scale, rotate) are reset each iteration. It is
 * responsible for drawing all of the objects ontop of the established canvas.
 * It will draw objects, move ships, print scores and adjust timers.
*/
function draw() {
   background(0);

   if (realWidth != windowWidth || realHeight != windowHeight){
      setupCanvas();
      resetButtons();
   }
   printInstructions();
   translate(windowWidth/2 - gameWidth/2,10);
   drawArcadeFrame();
   drawSprites();

   // Adjust Ship
   if (!userActivated) {
      specialEnemy = ship.decideMove(enemyBullets, enemies, bullets, shotCooldownTimer);
   }
   ship.move();
   ship.show();

   drawEnemies();
   if (specialEnemy){
      specialEnemy.targetShow();
      specialEnemy = null; // no ghost lingers after death or reset
   }
   drawBullets();
   drawEnemyBullets();

   // Wave Cleared
   if (enemies.length === 0){
      ship.scoreBonus("Wave Cleared");
      newWave();
   }

   // Print Score
   printScore();

   // reduce shotCooldownTimer
   shotCooldownTimer -= 1;
}

/*
 * drawEnemies() will identify where each of the surviving enemies are and draw them
 * on the canvas. It will also adjust the direction of enemies when they reach
 * the boundaries. This function will also determine if the enemies will shoot or
 * not.
*/
function drawEnemies(){
   for (var i = 0; i < enemies.length; i++){
      if ((enemies[i].getX() > gameWidth - 10 && enemies[i].getDirection() == 1) ||
                     (enemies[i].getX() < 10 && enemies[i].getDirection() == -1 )) {
         for (var j = 0; j < enemies.length; j++){
            enemies[j].changeDirn();
         }
      }
      enemies[i].move();
      enemies[i].show();
      if (i % 5 == 0) {
         var shoot = enemies[i].shoot();
         if (shoot){
            enemyBullets.push(new Bullet(enemies[i].getX(), enemies[i].getY(), -0.5*ship.level))
         }
      }
   }
}

/*
 * drawBullets() will move the existing bullets and show the bullets on the canvas.
 * It will also check if a bullet has hit an enemy.
*/
function drawBullets(){
   for (var i = bullets.length; i > 0; i--){
      bullets[i-1].move();
      if (bullets[i-1].y < -gameHeight){
         bullets.splice(i-1, 1);
         continue;
      } else{
         bullets[i-1].show();
      }
      for (var j = enemies.length; j > 0; j--){
         if (bullets[i-1].hit(enemies[j-1])){
            enemies[j-1].destroy();
            enemies.splice(j-1, 1);
            bullets.splice(i-1, 1);
            ship.scoreBonus("Enemy Shot");
            break;
         }
      }
   }
}

/*
 * drawEnemyBullets() will move the existing enemy bullets and show the bullets on the canvas.
 * It will also check if a bullet has hit the user (and trigger game over)
*/
function drawEnemyBullets() {
   for (var i = enemyBullets.length; i > 0; i--){
      enemyBullets[i-1].move();

      if (enemyBullets[i-1].y < 0){
         enemyBullets.splice(i-1, 1);
         continue;
      } else{
         enemyBullets[i-1].show();
      }
      if (enemyBullets[i-1].hit(ship)){
         console.log("GAME OVER");
         reset();
         break;
      }
   }
}

/* Handle IO Events */

/*
 * keyReleased() triggers when the keyboard key is released. This is for movement
*/
function keyReleased() {
   keyFlag = false;
   if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW){
      ship.setXVel(0);
   }

   if (keyCode === UP_ARROW || keyCode === DOWN_ARROW){
      ship.setYVel(0);
   }
}

/*
 * keyPressed() triggers when the keyboard key is pressed. This is for movement
 * and for firing.
*/
function keyPressed() {
   if (userActivated){
      if (keyCode === RIGHT_ARROW){
         ship.setMove(1);
      } else if (keyCode === LEFT_ARROW){
         ship.setMove(-1);
      }

      if (keyCode === UP_ARROW){
         ship.setYVel(-1);
      } else if (keyCode === DOWN_ARROW){
         ship.setYVel(1);
      }

      // Shoot bullet
      if (key === ' '){
         ship.fire(bullets);
      }
   }
}

/* Change game state functions */
/*
 * reset() will reset the game to the initial game state, destroying the existing
 * enemies and bullets and replacing them with new objects.
*/
function reset(){
   enemyBullets = []
   for (var i = 0; i < enemies.length; i++){
      enemies[i].destroy();
   }
   enemies = []
   ship.destroy();
   bullets = []
   if (ship.getScore() > highScore){
      highScore = ship.getScore();
   }
   setup();
}

/*
 * newWave() creates a new wave of enemies increasing in size from the previous
 * wave.
*/
function newWave(){
   if (enemiesPerRow === MAX_ENEMIES){
      enemiesPerRow = 5;
      enemyRows += 1;
   } else {
      enemiesPerRow += 1;
   }
   for (var i = 0; i < enemiesPerRow; i++){
      for (var j = 0; j < enemyRows; j++){
         enemies.push(new Enemy(i*30 + 30, j*30 + 30, ship.level));
      }
   }
}

/* Draw game */

/*
 * drawArcadeFrame() will draw the outer frame and background space image of the
 * arcade window.
*/
function drawArcadeFrame() {
   image(bgImg, 0,0,gameWidth,gameHeight);
   stroke(0, 255, 0);
   strokeWeight(3);
   noFill();
   rect(0, 0, gameWidth, gameHeight);
   noStroke();
}

/*
 * printScore() will print the current score and the highest existing score
*/
function printScore() {
   textSize(20);
   fill(0, 255, 0);
   textAlign(CENTER);
   textFont("Lilita One");
   text('Current Score: ' + ship.getScore(), gameWidth/2, gameHeight +fire.height*3.5);
   text('Highest Score: ' + highScore, gameWidth/2, gameHeight +fire.height*3.5 + 30);
}

/*
 * printInstructions() will print the instructions of the game.
*/
function printInstructions() {
   textSize(20);
   fill(0, 255, 0);
   textAlign(LEFT);
   textFont("Lilita One");
   text('Instructions', 25, 150);
   textSize(14);
   text('Arrow keys to move', 25, 180);
   text('Spacebar to fire', 25, 210);
   text('Or use UI buttons', 25, 240);
}
