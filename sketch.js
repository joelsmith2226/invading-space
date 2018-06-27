var ship;
var enemies = [];
var bullets = [];
var enemyBullets = [];
var gameHeight = 480;
var gameWidth = 300;

var enemyRows = 4
var enemiesPerRow = 5

const MAX_ENEMIES = 9

function setup() {
  createCanvas(303, 600);
  ship = new Ship();
  for (var i = 0; i < enemiesPerRow; i++){
     for (var j = 0; j < enemyRows; j++){
        enemies.push(new Enemy(i*30 + 30, j*30 + 30, ship.level));
     }
  }
}

function draw() {
   background(0);
   drawFrame();

   // Ship
   ship.move();
   ship.show();
   // Enemies
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


   // Bullets -- Player
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

   // Bullets -- Enemy
   for (var i = enemyBullets.length; i > 0; i--){
      enemyBullets[i-1].move();

      if (enemyBullets[i-1].y < 0){
         enemyBullets.splice(i-1, 1);
         continue;
      } else{
         enemyBullets[i-1].show();
      }
      if (enemyBullets[i-1].hit(ship)){
         console.log("GAME OVER")
         reset();
         break;
      }
   }

   // Wave Cleared
   if (enemies.length === 0){
      ship.scoreBonus("Wave Cleared");
      newWave();
   }

   // Print Score
   printScore();
}

function keyReleased() {
   if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW){
      ship.setXVel(0);
   }

   if (keyCode === UP_ARROW || keyCode === DOWN_ARROW){
      ship.setYVel(0);
   }
}

function keyPressed() {
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
   if (key === ' '){
      bullets.push(new Bullet(ship.x, ship.y-10, 2));
   }
}

function reset(){
   enemyBullets = []
   enemies = []
   bullets = []
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

function drawFrame() {
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
}
