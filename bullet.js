function Bullet(x, y, dir) {
   this.x = x;
   this.y = y;
   this.r = 5;
   this.direction = dir;

   this.show = function() {
      if (dir > 0){
         fill (255, 255, 0);
      } else {
         fill (255, 0, 0);
      }
      noStroke();
      ellipse(this.x, this.y, this.r*2, this.r*2);
   }

   this.move = function() {
      this.y -= this.direction;
   }

   this.hit = function(obj) {
      var d = dist(this.x, this.y, obj.x, obj.y);
      var hitBox = 0;
      if (obj instanceof Enemy){
         hitBox = obj.r;
      } else if (obj instanceof Ship){
         hitBox = 20;
         // console.log(hitBox, obj.r, d)
      }
      if (d < hitBox + this.r){
         return true;
      } else {
         return false;
      }
   }

   this.getX = function() {
      return this.x;
   }

   this.getY = function() {
      return this.y;
   }
}
