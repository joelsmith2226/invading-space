/*
 * Joel Smith
 * Invading Space
 * ship.js
 * This file creates a Ship object, either controlled by the user or the base
 * class for the basic AI class. This ship can move all directions and shoot, as
 * well as having an animated sprite.
 */

const SHIP_WIDTH = 20;
const SHIP_HEIGHT = 20;

/*
* Ship constructor.
*/
function Ship() {
   this.sprite = createSprite(gameWidth/2, gameHeight, SHIP_WIDTH, SHIP_HEIGHT);
   this.sprite.velocity.x = 0;
   this.sprite.velocity.y = 0;
   this.sprite.setCollider('circle', 0, 0, SHIP_WIDTH/2);
   this.sprite.addAnimation("default-ship", shipAnimation);
   this.sprite.rotation = -90;
   this.score = 0;
   this.level = 1;
   this.show = function() {
      fill(255);
      drawSprite(this.sprite);
   }
   
   /*
      move() moves the ship in the given direction dictated by velocity
   */
   this.move = function() {
      this.sprite.position.x += this.sprite.velocity.x;
      this.sprite.position.y += this.sprite.velocity.y;
   }

   /*
      setXVel() sets x velocity dictating direction in horizontal space
   */
   this.setXVel = function(dir) {
      this.sprite.velocity.x = dir;
   }

   /*
      setYVel() sets y velocity dictating direction in vertical space
   */
   this.setYVel = function(dir) {
      this.sprite.velocity.y = dir;
   }

   /*
      getXVel() gets x velocity dictating direction in horizontal space
   */
   this.getXVel = function() {
      return this.sprite.velocity.x;
   }

   /*
      getYVel() gets y velocity dictating direction in vertical space
   */
   this.getYVel = function() {
      return this.sprite.velocity.y;
   }

   /*
      getX() gets x coordinate
   */
   this.getX = function() {
      return this.sprite.position.x;
   }

   /*
      getY() gets y coordinate
   */
   this.getY = function() {
      return this.sprite.position.y;
   }

   /*
      getScore() gets score of ship of current game
   */
   this.getScore = function() {
      return this.score;
   }

   /*
      scoreBonus() generates the score bonus depending on the event.
   */
   this.scoreBonus = function(bonus){
      switch(bonus) {
         case "Enemy Shot":
            this.score += 50;
         case "Wave Cleared":
            this.score += 200;
            this.level += 0.1;
      }
   }

   /*
      destroy() removes the ship object sprite in the event of a game over or
      game reset.
   */
   this.destroy = function(){
      this.sprite.remove();
   }

   /*
      setMove() enables a more intuitive function call for dictating movement from
      other files
   */
   this.setMove = function(dir){
      this.setXVel(dir);
   }

   /*
      fire() will fire a bullet into the game if the shotCooldownTimer has expired.
   */
   this.fire = function(){
      if (shotCooldownTimer <= 0 && bullets){
         bullets.push(new Bullet(this.getX(), this.getY()-10, 2));
         shotCooldownTimer += SHOT_COOLDOWN;
      }
   }
}
