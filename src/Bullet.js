Bullet = function(x, y, direction){
	this.sprite = game.add.sprite(x, y, 'white');
	this.sprite.height = 4;
	this.sprite.width = 6;
	game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
	this.sprite.checkWorldBounds = true;
	this.sprite.body.allowGravity = false;
	//worldGroup.add(this.sprite);

	//this.sprite.body.collideWorldBounds = true;
	this.speed = 1000;

	this.outOfBounds = function(bullet){
		bullet.kill();
	}

	this.sprite.events.onOutOfBounds.add(this.outOfBounds);

	this.sprite.body.velocity.x = this.speed*direction;

	if(!config.isSpun){
		this.sprite.tint = 0x000000;
	}else{
		this.sprite.tint = 0xFFFFFF;
	}
}