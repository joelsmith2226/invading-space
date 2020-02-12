const SHIP_WIDTH = 20;
const SHIP_HEIGHT = 20;

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

   this.move = function() {
      this.sprite.position.x += this.sprite.velocity.x;
      this.sprite.position.y += this.sprite.velocity.y;
   }

   this.setXVel = function(dir) {
      this.sprite.velocity.x = dir;
   }

   this.setYVel = function(dir) {
      this.sprite.velocity.y = dir;
   }
   this.getXVel = function() {
      return this.sprite.velocity.x;
   }

   this.getYVel = function() {
      return this.sprite.velocity.y;
   }

   this.getX = function() {
      return this.sprite.position.x;
   }

   this.getY = function() {
      return this.sprite.position.y;
   }
   this.getScore = function() {
      return this.score;
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

   this.destroy = function(){
      this.sprite.remove();
   }

   this.setMove = function(dir){
      this.setXVel(dir);
   }

   this.fire = function(){
      if (shotCooldownTimer <= 0 && bullets){
         bullets.push(new Bullet(this.getX(), this.getY()-10, 2));
         shotCooldownTimer += SHOT_COOLDOWN;
      }
   }
}
