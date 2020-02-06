var ship, shipAnimation, enemyAnimation, bgImg;
var enemies = [];
var bullets = [];
var enemyBullets = [];
var gameHeight = 480;
var gameWidth = 300;
var enemyRows = 4;
var enemiesPerRow = 5;
var userActivated = true;
const MAX_ENEMIES = 9;
var keyFlag = false;
var basicAIButton;
var userButton;
var specialEnemy;
var shotCooldownTimer = 0;
const SHOT_COOLDOWN = 40;
var highScore = 0;
var font;

function preload() {
   shipAnimation = loadAnimation('assets/Ship/f1.png','assets/Ship/f2.png',
                              'assets/Ship/f3.png','assets/Ship/f4.png');
   enemyAnimation = loadAnimation('assets/Enemy/Example/e_f1.png','assets/Enemy/Example/e_f2.png',
                              'assets/Enemy/Example/e_f3.png','assets/Enemy/Example/e_f4.png');
}

function setup() {
   createCanvas(windowWidth, windowHeight);
   // Method 1 - Using width, height for each frame and number of frames
   sprites = loadSpriteSheet('assets/sprite-sheet.png', 18, 18, 26*12);
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
   let portKey = createButton("BACK TO <br>PORTFOLIO");
   portKey.class('start-btn');
   portKey.position(displayWidth-portKey.width*2,10);
   //portKey.mousePressed();
   //let link = createA("https://joelsmith2226.github.io", "Back to portfolio");
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

function draw() {
   background(0);
   translate(windowWidth/2 - gameWidth/2,0);
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
         ship.setXVel(1);
      } else if (keyCode === LEFT_ARROW){
         ship.setXVel(-1);
      }

      if (keyCode === UP_ARROW){
         ship.setYVel(-1);
      } else if (keyCode === DOWN_ARROW){
         ship.setYVel(1);
      }

      // Shoot bullet
      if (key === ' ' && shotCooldownTimer <= 0){
         bullets.push(new Bullet(ship.getX(), ship.getY()-10, 2));
         shotCooldownTimer += SHOT_COOLDOWN;
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
   textFont("Press Start 2P");
   text('Current Score: ' + ship.getScore(), gameWidth/2, height - 30);
   text('Highest Score: ' + highScore, gameWidth/2, height - 60);
}
