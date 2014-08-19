var WIDTH = 1040;
var HEIGHT = 630;
var game;

var config = {
	isLoading: true
}

window.onload = function(){
	game = new Phaser.Game(WIDTH, HEIGHT, Phaser.WEBGL, 'game', {preload: preload, create: create, update: update, render: render});

	doPreloadStuff();
}

function preload(){

}

function create(){

}

function update(){

}

function render(){

}

function doPreloadStuff(){
	$('#cuda').fadeIn(1500, function(){
		$('#logo').fadeIn(1500, function(){
			setTimeout(function(){
				$('#cuda').fadeOut(1000);
				$('#logo').fadeOut(1000, function(){
					$('#game-blocker').fadeOut(1000, function(){
						config.isLoading = false;
					});
				});
			}, 1000);
		});
	});
}

