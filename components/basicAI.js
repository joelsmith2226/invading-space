/*
 * Joel Smith
 * Invading Space
 * basicAI.js
 * This file creates a basic AI, whose strategy is to locate the closest enemy,
 * target and shoot it down and dodge any death-imminent bullets.
 */

const ILLEGAL_COOLDOWN = 100;
function BasicAI() {
   // BasicAI inherits Ship
   Ship.call(this);
   // Used incase an illegal move is attempted and need to get back to a position
   // where AI can make (hopefully) a better decision
   this.illegalCooldown = 0;

   /*
      decideMove() takes in current game state of bullets and enemies
      and decides the action/s to take (shoot and/or move)
      basicAI will move if death imminent and shoot often
   */
   this.decideMove = function (enemyBullets, enemies, bullets, shotCooldownTimer) {

      // Check if illegal countdown triggered
      if (this.illegalCooldown > 0){
         this.setXVel(1);
         this.illegalCooldown -= 1;
         return
      } else if (this.illegalCooldown < 0) {
         this.setXVel(-1);
         this.illegalCooldown += 1;
         return
      }

      // Find closest enemy
      var closestEnemy = this.findClosestEnemy(enemies);

      // Check if death imminent
      var deathAlert = this.isDeathImminent(enemyBullets);

      // If no imminent but not inline with an enemy
      if (!deathAlert) {
         this.directionToEnemy(closestEnemy);
      // If death imminent, MOVE
      } else {
         console.log("Hey death imminent");
         if (this.getX() > 0){
            this.setXVel(1);
         } else {
            this.setXVel(-1);
         }
      }

      //Check if legal move
      this.isLegalMove();

      // Always be shooting since there is no penalty for shots missed
      this.shoot();
      return closestEnemy;

   }

   /*
   * findClosestEnemy() locates the closest enemy by getting the straight-line
   * distance to each enemy.
   */
   this.findClosestEnemy = function(enemies){
      let closestDist = windowHeight*2;
      let closestEnemy = enemies[0];
      for (var i = 0; i < enemies.length; i++){
         let currEnemyDist = Math.sqrt(Math.pow(this.getX() - enemies[i].getX(), 2) +
                                       Math.pow(this.getY() - enemies[i].getY(), 2));
         if (currEnemyDist < closestDist) {
            closestDist = currEnemyDist;
            closestEnemy = enemies[i];
         }
      }
      return closestEnemy;
   }

   /*
   * isDeathImminent() identifies if any bullets are about to kill the AI (based off a
   * fixed radius). This is a simplistic view of avoiding death appropriate for basicAI
   */
   this.isDeathImminent = function(bullets){
      for (var i = 0; i < bullets.length; i++){
         if (Math.abs(this.getX() - bullets[i].getX()) < 10 &&
             Math.abs(this.getY() - bullets[i].getY()) < 10){
            return true;
         }
      }
      return false;
   }

   /*
   * directionToEnemy() identifies the direction to travel in to attack closest enemy
   */
   this.directionToEnemy = function(closestEnemy){
      if (this.getX() - closestEnemy.getX() > 0){
         this.setXVel(-1);
      } else {
         this.setXVel(1);
      }
   }

   /*
   * shoot() will continuously shoot in accordance with the shotCooldownTimer.
   * A timer is an imposed constraint otherwise the AI can create an infinite
   * stream of bullets which is unfair.
   */
   this.shoot = function(){
      if (shotCooldownTimer <= 0) {
         bullets.push(new Bullet(this.getX(), this.getY()-10, 2));
         shotCooldownTimer += SHOT_COOLDOWN;
      }
   }

   /*
   * isLegalMove() checks if the move that is being attempted is exceeding the
   * boundaries of the arcade frame, if it is, initiate a course correctino using
   * the illegal countdown.
   */
   this.isLegalMove = function(){
      if (this.getXVel() > 0 && this.getX() + SHIP_WIDTH > gameWidth + 5){
         this.setXVel(-1);
         this.illegalCooldown = -ILLEGAL_COOLDOWN;
         console.log("ILLEGAL RIGHT", this.illegalCooldown);
      } else if (this.getXVel() < 0 && this.getX() < 5) {
         this.setXVel(1);
         this.illegalCooldown = ILLEGAL_COOLDOWN;
         console.log("ILLEGAL LEFT", this.illegalCooldown);
      }
      console.log("Legal");
   }
}
