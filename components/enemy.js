/*
 * Joel Smith
 * Invading Space
 * enemy.js
 * This file is for the Enemy object
 *
 */

const ENEMY_WIDTH = 10;
const ENEMY_HEIGHT = 10;

/*
 * Enemy() creates an enemy object which operates as the classic space invaders
 * enemy; slowly moving horizontally in a large pack, then shifting down a level
 * at the arcade frame boundary. Each enemy has a random chance of shooting at
 * any point.
 *    x: initial x coordinate
 *    y: initial y coordinate
 *    level: level accomplished by the ship user which determines initial speed
 */
function Enemy(x, y, level) {
   this.sprite = createSprite(x, y, ENEMY_WIDTH, ENEMY_HEIGHT);
   this.sprite.setCollider('circle', 0, 0, ENEMY_WIDTH/2);
   this.sprite.addAnimation("default-enemy", enemyAnimation);
   this.level = level;
   this.direction = 1;
   this.velocity = 1;
   this.show = function() {
      fill(255);
      drawSprite(this.sprite);
   }

   /*
    * targetShow() function plants a small red circle on the enemy ship targetted
    * by the AI
    */
   this.targetShow = function() {
      fill(255,0,0);
      ellipse(this.getX(), this.getY(), 2, 2);
   }

   /*
    * move() moves the enemy in the given direction scalared by its velocity
    */
   this.move = function() {
      this.sprite.position.x += this.direction*0.4*this.velocity;
   }

   /*
    * changeDirn() adjusts the direction and increases the velocity by a factor
    * of the user's wave level.
    */
   this.changeDirn = function() {
      this.direction *= -1;
      this.sprite.position.y += 10;
      this.velocity += 0.04 * level;
   }


   /*
    * shoot() creates a 1 in 500 chance of shooting 60 times per second.
    */
   this.shoot = function() {
      var shootChance = random(0, 500);
      if (shootChance > 499) {
         return true;
      } else {
         return false;
      }
   }

   /*
    * getX() returns x coordinate
    */
   this.getX = function() {
      return this.sprite.position.x;
   }

   /*
    * getY() returns y coordinate
    */
   this.getY = function() {
      return this.sprite.position.y;
   }

   /*
    * getDirection() returns direction
    */
   this.getDirection = function() {
      return this.direction;
   }

   /*
   * destroy() removes the enemy object which is used when ship is hit by
   * a bullet or a game reset is initiated
   */
   this.destroy = function() {
      this.sprite.remove();
   }
}
