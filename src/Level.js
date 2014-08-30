Level = function(){
	this.bg;
	this.platforms = [];
	this.gate;
	this.blackfloor;
	this.whiteFloor;

	this.createLevel = function(){
		this.bg = game.add.sprite(-WIDTH, 0, 'white');
		this.bg.y = -HEIGHT/2;
		this.bg.height = HEIGHT;
		this.bg.width = WIDTH*4;
		worldGroup.add(this.bg);

		var platformHeight = 30;
		var platformWidth = 500;

		var rect1 = game.add.sprite(WIDTH/2, 65 + platformHeight, 'black');
		this.platforms.push(rect1);

		var rect2 = game.add.sprite(platformWidth/2 - 75, HEIGHT/2 - 100, 'black');
		this.platforms.push(rect2);

		var rect3 = game.add.sprite(WIDTH/2 + platformWidth/2 + 75, HEIGHT/2 - 100, 'black');
		this.platforms.push(rect3);

		var rect4 = game.add.sprite(WIDTH/2, HEIGHT - 65 - platformHeight, 'white');
		this.platforms.push(rect4);

		var rect5 = game.add.sprite(platformWidth/2 - 75, HEIGHT/2 + 100, 'white');
		this.platforms.push(rect5);

		var rect6 = game.add.sprite(WIDTH/2 + platformWidth/2 + 75, HEIGHT/2 + 100, 'white');
		this.platforms.push(rect6);

		for(var i = 0; i < this.platforms.length; i++){
			this.platforms[i].width = platformWidth;
			this.platforms[i].height = platformHeight;
			game.physics.enable(this.platforms[i], Phaser.Physics.ARCADE);
			this.platforms[i].anchor.setTo(0.5, 0.5);
			this.platforms[i].body.immovable = true;
			this.platforms[i].body.allowGravity = false;
			worldGroup.add(this.platforms[i]);
		}

		var rect7 = game.add.sprite(500, HEIGHT/2 - platformHeight/2, 'white');
		rect7.width = WIDTH + 500;
		rect7.height = platformHeight;
		game.physics.enable(rect7, Phaser.Physics.ARCADE);
		rect7.anchor.setTo(0.5, 0.5);
		rect7.body.immovable = true;
		rect7.body.allowGravity = false;
		this.platforms.push(rect7);
		worldGroup.add(rect7);
		this.blackFloor = rect7;
		this.blackFloor.body.checkCollision.up = false;

		var rect8 = game.add.sprite(500, HEIGHT/2 + platformHeight/2, 'black');
		rect8.width = WIDTH + 500;
		rect8.height = platformHeight;
		game.physics.enable(rect8, Phaser.Physics.ARCADE);
		rect8.anchor.setTo(0.5, 0.5);
		rect8.body.immovable = true;
		rect8.body.allowGravity = false;
		this.platforms.push(rect8);
		worldGroup.add(rect8);
		this.whiteFloor = rect8;

		this.gate = game.add.sprite(WIDTH/2, HEIGHT/2, 'gate');
		this.gate.animations.add('sheen');
		this.gate.anchor.setTo(0.5, 0.5);
		game.physics.enable(this.gate, Phaser.Physics.ARCADE);
		this.gate.body.immovable = true;
		this.gate.body.allowGravity = false;
		this.gate.body.setSize(this.gate.width - 60, this.gate.height - 60, 0, 0);
		//worldGroup.add(this.gate);
	};

	this.update = function(){
		if(!config.isLoading && game.time.now - config.lastLevelTime > 30000){
			config.lastLevelTime = game.time.now;
			config.enemyHealth += 0.5;
			config.enemySpeed += 0.5;
			config.spawnChance += 0.05;
			harderSfx.play();
			config.maxEnemies++;
		}

		if(!config.isSpinning){
			for(var i = 0; i < this.platforms.length; i++){
				var collide = game.physics.arcade.collide(player.sprite, this.platforms[i], function(playerSprite){
					if(playerSprite.body.touching.down){
						player.jumpTime = 0;
					}
				});

				for(var q = 0; q < enemies.length; q++){
					game.physics.arcade.collide(enemies[q].sprite, this.platforms[i]);
				}
			}
		}

		if(Math.random()*100 < 1){
			this.gate.play('sheen', 10, false);
		}
		this.gate.rotation += 0.001;

		for(var q = enemies.length - 1; q >= 0; q--){
			game.physics.arcade.collide(enemies[q].sprite, this.gate, function(){
				enemies[q].sprite.kill();

				if(!portalHitSfx.isPlaying){
					portalHitSfx.play();
				}

				enemies.splice(q, 1);

				player.looseLife();
			});
		}

		if(!config.isLoading && enemies.length < config.maxEnemies){
			if(Math.random()*100 < config.spawnChance){
				enemies.push(new Enemy());
			}
		}
		

		if(config.isSpinning){
			game.physics.arcade.gravity.y = 0;
			player.sprite.body.velocity.x = 0;
			player.sprite.body.velocity.y = 0;
			if(config.isSpun){
				if(worldGroup.angle + config.spinSpeed < 360){
						worldGroup.angle += config.spinSpeed;

						for(var i = 0; i < enemies.length; i++){
							enemies[i].calculatePosition();
						}
				}else{
					config.isSpinning = false;
					config.isSpun = false;
					game.physics.arcade.gravity.y = config.gravity;
					worldGroup.angle = 0;

					for(var i = 0; i < player.labels.length; i++){
						player.labels[i].element.css({color: 'black'});
					}

					for(var i = 0; i < enemies.length; i++){
						enemies[i].calculatePosition();
						enemies[i].direction *= -1;
					}

					this.blackFloor.body.checkCollision.up = false;
					this.whiteFloor.body.checkCollision.up = true;
					this.whiteFloor.body.checkCollision.down = false;
					this.blackFloor.body.checkCollision.down = true;
				}
			}else{
				if(worldGroup.angle + config.spinSpeed < 180){
					worldGroup.angle+= config.spinSpeed;

					for(var i = 0; i < enemies.length; i++){
						enemies[i].calculatePosition();
					}
				}else{
					config.isSpinning = false;
					config.isSpun = true;
					game.physics.arcade.gravity.y = config.gravity;
					worldGroup.angle = 180;

					for(var i = 0; i < player.labels.length; i++){
						player.labels[i].element.css({color: 'white'});
					}

					for(var i = 0; i < enemies.length; i++){
						enemies[i].calculatePosition();
						enemies[i].direction *= -1;
					}

					this.blackFloor.body.checkCollision.up = true;
					this.whiteFloor.body.checkCollision.up = false;
					this.whiteFloor.body.checkCollision.down = true;
					this.blackFloor.body.checkCollision.down = false;
				}
			}
		}
	};
}