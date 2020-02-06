// const RIGHT = 1;
// const LEFT = -l

const ENEMY_WIDTH = 10;
const ENEMY_HEIGHT = 10;

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

   this.targetShow = function() {
      fill(255,0,0);
      ellipse(this.getX(), this.getY(), 2, 2);
   }

   this.move = function() {
      this.sprite.position.x += this.direction*0.4*this.velocity;
   }

   this.changeDirn = function() {
      this.direction *= -1;
      this.sprite.position.y += 10;
      this.velocity += 0.04 * level;
   }

   this.shoot = function() {
      var shootChance = random(0, 500);
      if (shootChance > 499) {
         return true;
      } else {
         return false;
      }
   }

   this.getX = function() {
      return this.sprite.position.x;
   }

   this.getY = function() {
      return this.sprite.position.y;
   }

   this.getDirection = function() {
      return this.direction;
   }

   this.destroy = function() {
      this.sprite.remove();
   }
}
