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
	this.expForLevels = [0, 10, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 450, 500, 550, 600, 650, 700, 750,
	 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900, 1950, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2800,
	 2900, 3000, 3100, 3200, 3300, 3400, 3500, 3600, 3700, 3800, 4000, 4200, 4400, 4600, 4800, 5000, 5200, 5400, 5600, 5800, 6000, 6200, 6400, 6600,
	  6800, 7000, 7200, 7400, 7600, 7800, 8000, 8200, 8400, 8600, 8800, 9000, 9200, 9400, 9600, 9800, 10000, 10500, 11000, 11500, 12000, 12500, 13000, 13500, 14000,
	  14500, 15000, 15500, 16000, 16500, 17000, 17500, 18000, 18500, 19000, 19500, 20000, 21000, 22000, 23000, 24000, 25000, 26000, 27000, 28000, 29000, 30000, 31000,
	  32000, 33000, 34000, 35000, 36000, 37000, 38000, 39000, 40000, 41000, 42000, 43000, 44000, 45000, 46000, 47000, 48000, 49000, 50000, 1000000, 100000000000];
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

		// if(config.canSpin && this.sprite.y > HEIGHT/2 ){
		// 	config.isSpinning = true;
		// 	config.canSpin = false;
		// }

		this.expBar.width = (WIDTH - 594 - 10)*((this.exp - this.expForLevels[this.level])/(this.expForLevels[this.level + 1] - this.expForLevels[this.level]));

		//reset if the player falls below the world
		 if(this.sprite.y >= HEIGHT/2 + 28 ){
		 	this.sprite.y = 0;
		 	this.sprite.x = WIDTH/2;
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
		if(random <= 25){
			this.speedIncrease += 10;
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

	this.killBullet = function(bullet){
		var index = -1;
		for(var i = 0; i < this.bullets.length; i++){
			var bulletList = this.bullets[i].sprite;

			if(bullet == bulletList){
				index = i;
				break;
			}
		}

		if(index > -1){
			this.bullets.splice(index, 1);
			bullet.kill();
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