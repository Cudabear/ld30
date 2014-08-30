var WIDTH = 1040;
var HEIGHT = 630;
var game;
var player;
var enemies = [];
var input;
var level;
var worldGroup;

var music;
var hitSfx;
var portalHitSfx;
var rotateSfx;
var shootSfx;
var levelupSfx;
var jumpSfx;
var harderSfx;
var deadSfx;

var loadProgress = 0;

var config = {
	isLoading: true,
	isSpinning: false,
	isSpun: false,
	canSpin: true,
	spinSpeed: 6,
	gravity: 1000,
	lastLevelTime: 0,
	enemyHealth: 2,
	enemySpeed: 50,
	maxEnemies: 1,
	isDead: false,
	spawnChance: 2
}

window.onload = function(){
	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.OPENGL, 'game', {preload: preload, create: create, update: update, render: render});

	doPreloadStuff();
}

function preload(){
	//sprites and animations
	game.load.atlasJSONHash('guy', 'res/img/guy/render/guy-walk.png', 'res/img/guy/guy.json');
	game.load.atlasJSONHash('gate', 'res/img/gate/gate.png', 'res/img/gate/gate.json');
	game.load.atlasJSONHash('enemy', 'res/img/enemy/enemy.png', 'res/img/enemy/enemy.json');
	game.load.image('white', 'res/img/whitesquare.png');
	game.load.image('black', 'res/img/blacksquare.png');
	game.load.image('heart', 'res/img/heart/heart.png');
	game.load.image('exp', 'res/img/exp.png');
	loadProgress++;
	$('#loading-progress').val(loadProgress);

	//scripts

	//audio
	game.load.audio('music', 'res/sfx/music-1.mp3');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('hit', 'res/sfx/hit.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('portalhit', 'res/sfx/portalhit.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('rotate', 'res/sfx/rotate.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('shoot', 'res/sfx/shoot.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('levelup', 'res/sfx/levelup.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('jump', 'res/sfx/jump.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('harder', 'res/sfx/harder.wav');
	loadProgress++;
	$('#loading-progress').val(loadProgress);
	game.load.audio('dead', 'res/sfx/dead.wav');
	loadProgress++;
	finishLoading();
}

function create(){
	worldGroup = game.add.group();


	level = new Level();
	level.createLevel();

	music = game.add.audio('music', 5, true);
	hitSfx = game.add.audio('hit', 1, false);
	portalHitSfx = game.add.audio('portalhit', 1, false);
	rotateSfx = game.add.audio('rotate', 0.75, false);
	shootSfx = game.add.audio('shoot', 0.4, false);
	levelupSfx = game.add.audio('levelup', 1, false);
	jumpSfx = game.add.audio('jump', 0.4, false);
	harderSfx = game.add.audio('harder', 0.6, false);
	deadSfx = game.add.audio('dead', 1, false);

	music.play();

	//game.stage.backgroundColor = '#121212';
	//gotta base everything off 0, 0... so 0, 0 is actually this.
	game.world.bounds.setTo(0, 0, WIDTH, HEIGHT);
	game.world.camera.setBoundsToWorld();
	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = config.gravity;

	input = new InputHandler();

	player = new Player(WIDTH/2, 0);

	worldGroup.pivot.x = WIDTH/2;
	worldGroup.pivot.y = HEIGHT/2;
	worldGroup.x =  worldGroup.pivot.x;
	worldGroup.y =  worldGroup.pivot.y;
}

function update(){
	if(input){
		input.handleInput();
	}

	if(level){
		level.update();
	}

	if(player){
		player.update();
	}

	for(var i = 0; i< enemies.length; i++){
		enemies[i].update();
	}
}

function render(){
	//game.debug.body(player.sprite);
	for(var i = 0; i < level.platforms.length; i++){
		//game.debug.body(level.platforms[i]);
	}

	for(var i = 0; i < enemies.length; i++){
		//game.debug.body(enemies[i].sprite);
	}

	//game.debug.body(level.gate);
}

function doPreloadStuff(){
	$('#cuda').fadeIn(1500, function(){
		$('#logo').fadeIn(1500, function(){
			setTimeout(function(){
				$('#cuda').fadeOut(1000);
				$('#logo').fadeOut(1000, function(){

					$('#game-blocker').html(
						'<div id="main-menu" style="width: 1040px; height: 580px; margin: 0px auto; padding-top: 50px; background-image: url(res/img/gate/singlegate.png); background-size: 140%; background-position: -335px -490px; background-repeat: no-repeat;">' +
							'<p style="text-align: center;"> The Bunny Theory </p>'+
							'<p style="font-size: 18px; text-align: center;"> A game made by Cudabear in 48 hours for <br>Ludum Dare 30: Connected Worlds </p>'+
							'<p style="font-size: 18px; text-align: center;"> Prevent the transdimentional space bunnies from destroying your home world! </p>'+
							'<p style="font-size: 12px; text-align: center;"> Controls: </p>'+
							'<p style="font-size: 12px; text-align: center;"> Arrow Keys to Move </p>'+
							'<p style="font-size: 12px; text-align: center;"> X or Up to jump </p>'+
							'<p style="font-size: 12px; text-align: center;"> Z to Shoot </p>'+
							'<p style="font-size: 12px; text-align: center;"> Space to spin the World </p>'+
							'<progress style="width: 500px; margin-left: 320px;" id="loading-progress" max="10" value="0"></progress>'+
						'</div>'
					);

						$('#loading-progress').val(loadProgress);
						if(loadProgress > 9){
							finishLoading();
						}
				});
			}, 1000);
		});
	});

	//$('#game-blocker').hide();

	//stop spacebar from scrolling the webpage
	window.onkeydown = function(e){
		if(e.keyCode == 32 && e.target == document.body){
			e.preventDefault();
			return false;
		}
	}
 }

 function startGame(){
	$('#game-blocker').fadeOut(1000, function(){
	 	config.isLoading = false;
		config.lastLevelTime = game.time.now;
		$('#game-blocker').empty();
	});

 }

 function finishLoading(){
 	$('#loading-progress').remove();
 	$('#main-menu').append(
 		$.parseHTML('<button style="border-radius: 5px; font-size: 18px; width: 300px; height: 50px; margin-top: 20px; margin-left: 365px;" onclick="startGame()"> Start Game </button>')
 	);
 }

//warning - modified for use with broken enemies lol
 function intersectSprite(sprite1, sprite2){
 	  return !(sprite2.x > (sprite1.x + Math.abs(sprite1.width)) || 
           (sprite2.x + Math.abs(sprite2.width)) < sprite1.x || 
           sprite2.y - Math.abs(sprite2.height)/2 > (sprite1.y + Math.abs(sprite1.height)) ||
           (sprite2.y - Math.abs(sprite2.height)/2 + Math.abs(sprite2.height)) < sprite1.y);
 }

 function gameOver(){
 	config.isDead = true;
 	$('#game-blocker').html(
		'<div id="main-menu" style="width: 1040px; height: 430px; margin: 0px auto; padding-top: 200px; background-image: url(res/img/gate/singlegate.png); background-size: 140%; background-position: -335px -490px; background-repeat: no-repeat;">' +
			'<p style="font-size: 18px; text-align: center;"> Oh no!  The bunnies have destroyed your home world! </p>'+
			'<p style="font-size: 18px; text-align: center;"> You dispatched '+player.kills+' bunnies, and were level '+player.level+'. </p>'+
			'<p style="font-size: 12px; text-align: center;"> Defeat was inevitable! </p>'+
			'<button style="border-radius: 5px; font-size: 18px; width: 300px; height: 50px; margin-top: 20px; margin-left: 365px;" onclick="restartGame()"> Try again? </button>' +
		'</div>'
 	);
 	$('#game-blocker').fadeIn(function(){

 	});
 }

 function restartGame(){
	config = {
		isLoading: false,
		isSpinning: false,
		isSpun: false,
		canSpin: true,
		spinSpeed: 6,
		gravity: 1000,
		lastLevelTime: game.time.now,
		enemyHealth: 2,
		enemySpeed: 50,
		maxEnemies: 1,
		isDead: false
	}

	for(var i = 0; i < enemies.length; i++){
		enemies[i].sprite.kill();
	}

	enemies = [];
	player.reset();

	$('#game-blocker').fadeOut(function(){
		$('#game-blocker').empty();
	})
 }


