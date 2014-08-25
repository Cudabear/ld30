Player = function(x, y){
	this.sprite = game.add.sprite(x, y, 'guy');
	this.sprite.animations.add('walk', [0,1,2,3,4,5,6,7,8,9,10,11]);
	this.sprite.animations.add('stand', [12,13,14,15]);
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale = {x: 0.5, y: 0.5};
	game.physics.enable(this.sprite,  Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;

	this.hearts = [];
	this.lifeCount = 4;
	this.bullets = []
	this.labels = [];

	this.expLabel = game.add.sprite(WIDTH/2, HEIGHT - 32 - 10, 'exp');
	this.expBar = game.add.sprite(WIDTH/2 + 64 + 10, HEIGHT - 32 - 5, 'white');
	this.exp = 0;
	this.expForLevels = [0, 10, 25, 50, 75, 100, 125, 150, 200, 250, 300, 350, 450, 600, 750, 900, 1100, 1300, 1500, 1750, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 6000, 7000, 8000, 9000, 10000, 25000, 50000, 100000, 100000000000];
	this.level = 0;
	this.comboCount = 0;


	this.jumpTime = 0;
	this.bulletTime = 0;

	this.speed = 150;
	this.speedIncrease = 0;
	this.damage = 1;
	this.fireRate = 25;
	this.kills = 0;

	this.doWalk = function(){
		this.sprite.animations.play('walk', 12, false);
	}

	this.doStand = function(){
		this.sprite.animations.play('stand', 12, false);
	}

	this.update = function(){
		if(!config.isSpun || this.sprite.y > HEIGHT/2 + this.sprite.height/2){
			this.sprite.tint = 0x000000;
		}else{
			this.sprite.tint = 0xFFFFFF;
		}

		if(config.canSpin && this.sprite.y > HEIGHT/2 ){
			config.isSpinning = true;
			config.canSpin = false;
		}

		this.expBar.width = (WIDTH - 594 - 10)*((this.exp - this.expForLevels[this.level])/(this.expForLevels[this.level + 1] - this.expForLevels[this.level]));

		if(this.sprite.y >= HEIGHT/2 + 28 ){
			config.canSpin = true;
		}

		if(this.bulletTime > 0){
			this.bulletTime--;
		}

		if(this.hearts.length < this.lifeCount){
			var heart = game.add.sprite(this.hearts.length*40 + 10, HEIGHT - 10 - 32, 'heart');
			this.hearts.push(heart);
		}

		var heartColor;
		if(!config.isSpun){
			heartColor = 0xFFFFFF;
		}else{
			heartColor = 0x000000;
		}

		for(var i = this.labels.length- 1; i >= 0; i--){
			this.labels[i].raise();
			this.labels[i].age++;

			if(this.labels[i].age > 50){
				this.labels[i].destroy();
				this.labels.splice(i, 1);
			}
		}

		for(var i = 0; i < this.hearts.length; i++){
			this.hearts[i].tint = heartColor;
		}
		this.expLabel.tint = heartColor;
		this.expBar.tint = heartColor;

		for(var i = this.bullets.length - 1; i >= 0; i--){
			for(var q = enemies.length - 1; q >= 0; q--){
				if(i < this.bullets.length && q < enemies.length){
					var bullet = this.bullets[i].sprite;
					var enemyObj = enemies[q];
					var enemy = enemies[q].sprite;

					if(intersectSprite(bullet, enemy)){
						enemyObj.health -= this.damage;

						hitSfx.play();

						bullet.kill();
						this.bullets.splice(i, 1);
						if(enemyObj.health <= 0){
							this.confirmKill(enemy);
							
							enemy.kill();
							deadSfx.play();

							
							enemies.splice(q, 1);
						}


					}
				}
			}
		}
	}

	this.confirmKill = function(enemy){
		this.comboCount++;
		this.exp += this.comboCount;

		this.labels.push(new Label(enemy.x, enemy.y, 'x'+this.comboCount));

		if(this.exp >= this.expForLevels[this.level + 1]){
			this.levelUp();
		}

		this.kills++;
	}

	this.levelUp = function(){
		this.level++;

		var random = Math.random()*100;
		var msg = '';
		if(random <= 33){
			this.speedIncrease += 5;
			msg = "+speed!";
		}else if(random <= 60){
			this.damage++;
			msg = "+damage!";
		}else if (random <= 90){
			this.fireRate-=1;
			msg = "+fire rate!";
		}else{
			this.lifeCount++;
			msg = "+life!";
		}

		this.labels.push(new Label(this.sprite.x, this.sprite.y, msg));
		levelupSfx.play();
	}

	this.looseLife = function(){
		if(this.lifeCount > 0){
			this.hearts[this.hearts.length -1].kill();
			this.lifeCount--;

			this.hearts.splice(this.hearts.length-1, 1);

			if(this.lifeCount < 1){
				gameOver();
			}
		}else{
			//gameOver();
		}
	}

	this.handleMovement = function(direction){
		switch(direction){
			case 'none':

				this.sprite.body.velocity.x = 0;

				this.doStand();
			break;
			case 'left':
				this.doWalk();
				this.sprite.scale.x = -0.5;

				this.sprite.body.velocity.x = -this.speed - this.speedIncrease;

			break;
			case 'right':
				this.doWalk();
				this.sprite.scale.x = 0.5;

				this.sprite.body.velocity.x = this.speed + this.speedIncrease;

			break;
		}
	}

	this.handleJump = function(){
			if(this.sprite.body.onFloor() || this.sprite.body.touching.down){
				this.jumpTime = 0;
			}

			//wierd bug prevents jumping
			if(this.jumpTime === 0){
				this.sprite.y -= 1;
				this.sprite.body.velocity.y = -500;
				this.jumpTime = 1;

				if(!jumpSfx.isPlaying){
					jumpSfx.play();
				}
			}
	}

	this.handleShoot = function(){
		if(this.bulletTime <= 0){
			this.bullets.push(new Bullet(this.sprite.x + 17*(this.sprite.scale.x < 0 ? -1 : 1), this.sprite.y - 5, this.sprite.scale.x < 0 ? -1: 1));
			this.bulletTime = this.fireRate;

			//if(!shootSfx.isPlaying){
				shootSfx.play();
			//}
		}
	}

	this.reset = function(){
		this.lifeCount = 4;
		this.exp = 0;
		this.level = 0;
		this.comboCount = 0;
		this.jumpTime = 0;
		this.bulletTime = 0;

		this.sprite.x = WIDTH/2;
		this.sprite.y = 0;

		this.speed = 150;
		this.speedIncrease = 0;
		this.damage = 1;
		this.fireRate = 25;
		this.hearts = [];
		this.lifeCount = 4;
		//this.bullets = []
		//this.labels = [];
		this.kills = 0;
	}
}