var shipWidth = 20;
var shipHeight = 20;

function Ship() {
   this.x = gameWidth/2;
   this.y = gameHeight;
   this.xvel = 0;
   this.yvel = 0;
   this.score = 0;
   this.level = 1;
   this.show = function() {
      fill(255);
      rect(this.x, this.y-shipHeight, shipWidth, shipHeight);
   }

   this.move = function() {
      this.x += this.xvel;
      this.y += this.yvel;
   }

   this.setXVel = function(dir) {
      this.xvel = dir;
   }

   this.setYVel = function(dir) {
      this.yvel = dir;
   }
   this.getXVel = function() {
      return this.xvel;
   }

   this.getYVel = function() {
      return this.yvel;
   }

   this.scoreBonus = function(bonus){
      switch(bonus) {
         case "Enemy Shot":
            this.score += 50;
         case "Wave Cleared":
            this.score += 200;
            this.level += 0.1;
      }
   }
}
