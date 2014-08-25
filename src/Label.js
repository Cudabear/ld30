Label = function(x, y, text){
	this.x = x;
	this.y = y;
	this.text = text;
	this.top = this.y;
	labelId++;
	this.age = 0;

	this.marginLeft = $('#game').position().left;
	this.element = '<span id="label-'+labelId+'" style="top: '+this.top+'; left: '+(this.x+this.marginLeft)+'; color: '+(config.isSpun ? 'white':'black')
				+'" class="label"> ' + text + '</span>';
	this.element = $('#game-wrapper').append(this.element);
	this.element = $('#label-'+labelId);

	this.setText = function(text){
		this.text = text;
	}

	this.destroy = function(){
		this.element.remove();
	}

	this.raise = function(){
		this.element.css({top: this.element.position().top -1});
	}
}

labelId = 0;