var ship;
var enemies = [];
var bullets = [];
var enemyBullets = [];
var gameHeight = 480;
var gameWidth = 300;
var enemyRows = 4;
var enemiesPerRow = 5;
var userActivated = true;
const MAX_ENEMIES = 9;
var dummy;
var keyFlag = false;
var basicAIButton;
var userButton;
var specialEnemy;
var shotCooldownTimer = 0;
const SHOT_COOLDOWN = 40;
var highScore = 0;

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
   dummy = createSprite(100,100, 30, 30);
   dummy.addImage(loadImage(sprites[0]));

   //Setup buttons
   basicAIButton = createButton("Basic AI");
   basicAIButton.position(10,10);
   basicAIButton.mousePressed(activateBasicAI);
   userButton = createButton("User");
   userButton.position(10,40);
   userButton.mousePressed(activateUser);

   //Portfolio link
   let link = createA("https://joelsmith2226.github.io", "Back to portfolio");
   link.position(displayWidth-link.width*2,10);
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
      if ((enemies[i].x > gameWidth - 10 && enemies[i].direction === 1) ||
      (enemies[i].x < 10             && enemies[i].direction === -1 )) {
         for (var j = 0; j < enemies.length; j++){
            enemies[j].changeDirn();
         }
      }
      enemies[i].move();
      enemies[i].show();
      if (i % 5 == 0) {
         var shoot = enemies[i].shoot();
         if (shoot){
            enemyBullets.push(new Bullet(enemies[i].x, enemies[i].y, -0.5*ship.level))
         }
      }
   }
}

function drawBullets(){
   for (var i = bullets.length; i > 0; i--){
      bullets[i-1].move();
      if (bullets[i-1].y < -gameHeight){
         console.log("off screen")
         bullets.splice(i-1, 1);
         continue;
      } else{
         bullets[i-1].show();
      }
      for (var j = enemies.length; j > 0; j--){
         if (bullets[i-1].hit(enemies[j-1])){
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
         bullets.push(new Bullet(ship.x, ship.y-10, 2));
         shotCooldownTimer += SHOT_COOLDOWN;
      }
   }
}

/* Change game state functions */

function reset(){
   enemyBullets = []
   enemies = []
   bullets = []
   if (ship.score > highScore){
      highScore = ship.score;
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
   text('Current Score: ' + ship.score, gameWidth/2, height - 30);
   textSize(20);
   fill(0, 255, 0);
   textAlign(CENTER);
   text('Highest Score: ' + highScore, gameWidth/2, height - 60);
}
