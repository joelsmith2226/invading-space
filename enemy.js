// const RIGHT = 1;
// const LEFT = -l

function Enemy(x, y, level) {
   this.x = x;
   this.y = y;
   this.r = 10;
   this.direction = 1;
   this.velocity = 1;
   this.level = level;

   this.show = function() {
      fill(0, 255, 0);
      ellipse(this.x, this.y, this.r*2, this.r*2);
   }

   this.move = function() {
      this.x += this.direction*0.4*this.velocity;
   }

   this.changeDirn = function() {
      this.direction *= -1;
      this.y += 10;
      this.velocity += 0.1 * level;
   }

   this.shoot = function() {
      var shootChance = random(0, 500);
      if (shootChance > 499) {
         return true;
      } else {
         return false;
      }
   }
}
