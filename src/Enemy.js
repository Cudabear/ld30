Enemy = function(){
	this.spawns = [
		{x: WIDTH/2, y: 0},
		{x: WIDTH/2, y: 0},
		{x: WIDTH/2, y: 0},
		{x: WIDTH/2, y: HEIGHT},
		{x: WIDTH/2, y: HEIGHT},
		{x: WIDTH/2, y: HEIGHT},
		{x: 0, y: 275},
		{x: WIDTH - 50, y: 275},
		{x: 0, y: 350},
		{x: WIDTH - 50, y: 350}
	]

	var spawnIndex = Math.min(Math.round(Math.random()*this.spawns.length), this.spawns.length - 1);

	var spawn = this.spawns[spawnIndex];

	this.speed = config.enemySpeed;
	if(spawnIndex > 5){
		this.speed /= 4;
	}

	this.health = config.enemyHealth;

	this.sprite = game.add.sprite(spawn.x, spawn.y, 'enemy');
	this.sprite.animations.add('hop');
	this.sprite.anchor.setTo(0.5, 0.5);
	this.sprite.scale = {x: 0.75, y: 0.75};
	game.physics.enable(this.sprite,  Phaser.Physics.ARCADE);
	this.sprite.body.collideWorldBounds = true;
	this.lastRotation = Infinity;
	if(this.sprite.y < HEIGHT/2){
		this.sprite.body.gravity.y = config.gravity;
	}else{
		this.sprite.body.gravity.y = -config.gravity*5;
	}
	//worldGroup.add(this.sprite);

	//-1 is left, 1 is right
	this.direction = Math.random() >= .5 ? 1 : -1;
	this.sprite.scale.x = this.direction > 0 ? 0.75 : -0.75;
	this.sprite.animations.play('hop', 12, true);
	this.update = function(){
		if(!config.isSpinning){
			if(this.sprite.body.touching.left  || this.sprite.x - Math.abs(this.sprite.width)/2 <= 0){
				this.direction = 1;
			}

			if(this.sprite.body.touching.right ||  this.sprite.x + Math.abs(this.sprite.width)/2 >= WIDTH){
				this.direction = -1;
			}

			this.sprite.body.velocity.x = this.speed*this.direction;
			this.sprite.scale.x = 0.75* this.direction;
			this.sprite.body.collideWorldBounds = true;
			if(this.sprite.y < HEIGHT/2){
				this.sprite.body.gravity.y = config.gravity;
				this.sprite.scale.y = 0.75;
			}else{
				this.sprite.body.gravity.y = -config.gravity*5;
				this.sprite.scale.y = -0.75
			}
			this.lastRotation = Infinity;
		}else{
			this.sprite.body.collideWorldBounds = false;
			this.sprite.body.velocity.x = 0;
			this.sprite.body.velocity.y = 0;
			this.sprite.body.gravity.y = 0;
		}

		if((this.sprite.y < HEIGHT/2 && !config.isSpun) || (this.sprite.y > HEIGHT/2 && config.isSpun)){
			this.sprite.tint = 0x000000;
		}else{
			this.sprite.tint = 0xFFFFFF;
		}
	}

	this.calculatePosition = function(){
		this.sprite.body.gravity.y = 0;
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		this.sprite.body.collideWorldBounds = false;
		var dx = (this.sprite.x - WIDTH/2) ;
		var dy = (this.sprite.y - HEIGHT/2) ;
		var radius = Math.sqrt(dx*dx + dy*dy);
		

		if(this.lastRotation == Infinity ){
			this.lastRotation = Math.atan2(dy, dx);
		}

		this.lastRotation += config.spinSpeed*(Math.PI/180);

		//this.sprite.angle = worldGroup.angle;
		this.sprite.x = WIDTH/2 + Math.cos(this.lastRotation) * (radius);
		this.sprite.y = HEIGHT/2 + Math.sin(this.lastRotation) * (radius);
	}
}

