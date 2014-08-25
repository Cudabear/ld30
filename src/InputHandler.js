InputHandler = function(){
	this.jumpKey = Phaser.Keyboard.X;
	this.pickupKey = Phaser.Keyboard.Z;
	this.leftKey = Phaser.Keyboard.LEFT;
	this.rightKey = Phaser.Keyboard.RIGHT;
	this.upKey = Phaser.Keyboard.UP;
	this.restartKey = Phaser.Keyboard.R;
	this.spinKey = Phaser.Keyboard.SPACEBAR

	this.lastRInput = 0;

	this.handleInput = function(){
		if(!config.isLoading && !config.isDead){
			//handle actions
			if(game.input.keyboard.isDown(this.pickupKey)){
				this.handleFire();
			}

			if(game.input.keyboard.isDown(this.jumpKey) || game.input.keyboard.isDown(this.upKey)){
				this.handleJump();
			}

			if(game.input.keyboard.isDown(this.restartKey)){
				if(this.lastRInput + 1000 < game.time.now){

					this.lastRInput = game.time.now;
				}
			}

			if(game.input.keyboard.isDown(this.spinKey)){
				this.handleSpin();
			}

			//handle movement
			if(game.input.keyboard.isDown(this.leftKey)){
				this.handleMovement('left');
			}else if(game.input.keyboard.isDown(this.rightKey)){
				this.handleMovement('right');
			}else{
				this.handleMovement('none');
			}
		}
	}

	this.handleMovement = function(direction){
		player.handleMovement(direction);
	}

	this.handleJump = function(){
		player.handleJump();
	}

	this.handleFire = function(){
		player.handleShoot();
	}

	this.handleSpin = function(){
		if(!config.isSpinning){
			rotateSfx.play();
		}

		config.isSpinning = true;
		player.comboCount = 0;


	}
}