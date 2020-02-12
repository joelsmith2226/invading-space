var ship, shipAnimation, enemyAnimation, bgImg;
var enemies = [];
var bullets = [];
var enemyBullets = [];
var gameHeight, gameWidth, realWidth, realHeight;

var enemyRows = 4;
var enemiesPerRow = 5;
var userActivated = true;
var keyFlag = false;
var specialEnemy;
var basicAIButton, userButton;

var shotCooldownTimer = 0;
var highScore = 0;

const SHOT_COOLDOWN = 40;
const MAX_ENEMIES = 9;
const DEFAULT_WIDTH = 300;
const DEFAULT_HEIGHT = 480;


function preload() {
   shipAnimation = loadAnimation('assets/Ship/f1.png','assets/Ship/f2.png',
                              'assets/Ship/f3.png','assets/Ship/f4.png');
   enemyAnimation = loadAnimation('assets/Enemy/Example/e_f1.png','assets/Enemy/Example/e_f2.png',
                              'assets/Enemy/Example/e_f3.png','assets/Enemy/Example/e_f4.png');
}

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

function setupCanvas(){
   createCanvas(windowWidth, windowHeight);
   console.log(gameHeight, gameWidth);
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

function drawEnemies(){
   for (var i = 0; i < enemies.length; i++){
      if ((enemies[i].getX() > gameWidth - 10 && enemies[i].getDirection() == 1) ||
      (enemies[i].getX() < 10             && enemies[i].getDirection() == -1 )) {
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

function keyReleased() {
   keyFlag = false;
   if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW){
      ship.setXVel(0);
   }

   if (keyCode === UP_ARROW || keyCode === DOWN_ARROW){
      ship.setYVel(0);
   }
}

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

function drawArcadeFrame() {
   image(bgImg, 0,0,gameWidth,gameHeight);
   stroke(0, 255, 0);
   strokeWeight(3);
   noFill();
   rect(0, 0, gameWidth, gameHeight);
   noStroke();
}

function printScore() {
   textSize(20);
   fill(0, 255, 0);
   textAlign(CENTER);
   textFont("Lilita One");
   text('Current Score: ' + ship.getScore(), gameWidth/2, gameHeight +fire.height*3.5);
   text('Highest Score: ' + highScore, gameWidth/2, gameHeight +fire.height*3.5 + 30);
}

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
