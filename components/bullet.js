/*
 * Joel Smith
 * Invading Space
 * bullet.js
 * This file is for the Bullet object (both enemy bullet and user bullet)
 *
 */

function Bullet(x, y, dir) {
   this.x = x;
   this.y = y;
   this.r = 5;
   this.direction = dir;

   /*
   * This will display the bullet on the canvas as an ellipse of the correct colour
   */
   this.show = function() {
      if (dir > 0){
         fill (255, 255, 0);
      } else {
         fill (255, 0, 0);
      }
      noStroke();
      ellipse(this.x, this.y, this.r*2, this.r*2);
   }

   /*
   * move() moves the bullet in the correct direction
   */
   this.move = function() {
      this.y -= this.direction;
   }

   /*
   * hit() detects whether this bullet has hit the given object
   */
   this.hit = function(obj) {
      var d = dist(this.x, this.y, obj.getX(), obj.getY());
      var hitBox = 0;
      if (obj instanceof Enemy){
         hitBox = ENEMY_WIDTH;
      } else if (obj instanceof Ship){
         hitBox = SHIP_WIDTH;
      }
      if (d < hitBox + this.r){
         return true;
      } else {
         return false;
      }
   }

   /*
   * getX() returns the x coordinate.
   */
   this.getX = function() {
      return this.x;
   }

   /*
   * getY() returns the y coordinate.
   */
   this.getY = function() {
      return this.y;
   }
}
