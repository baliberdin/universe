var app;
var started = false;
var cells = [[]];
var matrix = new Array();
var actions = 0;
var maxActions = 4;
var colors = new Array();
var generation = 0;

class Actor {

	constructor(ctx, x, y, r, alive){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.r = r;
		this.alive = alive;
		this.color = "#000";
		this.fit = 0;

		this.dna = new Array();
		this.dna_indx = 0;

		for(var i=0; i<maxActions;i++){
			this.dna[i] =  rand(0,5);
		}
	};

	isAlive(){
		return this.alive;
	};


	create(){
		if(this.alive){
			this.ctx.fillStyle = this.color;
		}else{
			this.ctx.fillStyle = "#ffffff";
		}
		
		this.ctx.fillRect(this.x*this.r+1,this.y*this.r+1,this.r-2,this.r-2);
		this.ctx.fill();
	};

	draw(){
		this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.x*this.r+1,this.y*this.r+1,this.r-2,this.r-2);
		this.ctx.fill();
	};

	clear(){
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillRect(this.x*this.r+1,this.y*this.r+1,this.r-2,this.r-2);
		this.ctx.fill();
	};

	revert(x,y){
		if(this.alive){
			this.alive = false;
		}else{
			this.alive = true;
		}

		this.create(x,y);
	};

	move(){
		var oldX = this.x;
		var oldY = this.y;

		this.clear();

		switch(this.dna[this.dna_indx]){

			case 0:
				break;

			case 1:
				if(this.y > 0){
					if(matrix[this.x][this.y-1] == undefined){
						this.y = this.y - 1;	
					}
				} 
				break;

			case 2:
				if(this.x < matrix.length-1){
					if(matrix[this.x+1][this.y] == undefined){
						this.x = this.x + 1;
					}
				}
				break;

			case 3:
				if(this.y < matrix[0].length-1){
					if(matrix[this.x][this.y+1] == undefined){
						this.y = this.y + 1;
					}
				}
				break;

			case 4:
				if(this.x > 0){
					if(matrix[this.x-1][this.y] == undefined){
						this.x = this.x - 1;
					}
				}
				break;
		}

		if(this.dna_indx < this.dna.length){
			this.dna_indx++;	
		}

		if(oldX != this.x || oldY != this.y){
			var a = matrix[oldX][oldY];
			matrix[oldX][oldY] = undefined;
			matrix[this.x][this.y] = a;
		}
		
		this.draw();
	}
}

$(document).ready(function(){
	var scene = document.getElementById("universe");

	var width = window.innerWidth/6*4;
	var height = window.innerHeight/5*4;

	//var width = 800;
	//var height = 400;

	var r = 10;

	var ctxw = Math.floor(width/r)*r;
	var ctxh = Math.floor(height/r)*r;
	
	$("#universe").attr("width", ctxw);
	$("#universe").attr("height", ctxh);

	for(var i=0; i<ctxw/r; i++){
		matrix[i] = new Array(Math.floor(ctxh/r));
	}

	for(var i=0; i<1000; i++){
		colors.push(getRandomColor());
	}

	var ctx = scene.getContext("2d");
	drawGrid(ctx,r, ctxw, ctxh);
	
	var rainbow = new Rainbow();
	rainbow.setNumberRange(0, 100);
	rainbow.setSpectrum('black', 'red', 'orange', 'yellow');

	buildRandomCells(ctx,r);

	setInterval(checkCells,80);
	
});

function buildRandomCells(ctx,r){
	for(var i=0; i< matrix.length; i++){
		var bottom = Math.floor((matrix[i].length-1));
		if(randBoolean(40)){
			matrix[i][bottom] = new Actor(ctx,i,bottom,r, true);
			matrix[i][bottom].color = colors[generation];
			matrix[i][bottom].create(i,bottom);
		}
	}

	// var x = 0;
	// var y = matrix[0].length-1;
	// matrix[x][y] = new Actor(ctx,x,y,r, true);
	// matrix[x][y].create();
}

function bornCells(){
	var actors = new Array();
	for(var i=0; i< matrix.length; i++){
		for(var j=0; j< matrix[i].length; j++){
			if(matrix[i][j] != undefined && matrix[i][j].isAlive()){
				actors.push(matrix[i][j]);
			}
		}
	}

	var ctx = actors[0].ctx;
	var r = actors[0].r;

	var bottom = Math.floor((matrix[0].length-1));
	for(var i=0; i<actors.length-1; i=i+2){
		
		var px = actors[i].x + Math.floor(Math.abs(actors[i].x - actors[i+1].x)/2);
		var py = actors[i].y + Math.floor(Math.abs(actors[i].y - actors[i+1].y)/2);

		if(matrix[px][py] != undefined && matrix[px][py].alive)continue;

		//console.log("x: "+px+" - py: "+py);

		var dna1 = actors[i].dna;
		var dna2 = actors[i+1];
		var newDna = mixDna(dna1,dna2);

		if(randBoolean(40)){
			matrix[px][py] = new Actor(ctx,px,py,r, true);
			matrix[px][py].dna = newDna;
			matrix[px][py].color = colors[generation];
			matrix[px][py].create(px,py);
		}
	}
}

function mixDna(dna1,dna2){
	var dna = new Array();
	var mDna = dna1;

	if(dna2.length > dna1.length)mDna = dna2;

	for(var i=0; i<dna1.length; i++){
		if(rand(0,2) == 0){
			if(dna1[i] == undefined){
				dna.push(rand(0,5));
			}else{
				dna.push(dna1[i]);
			}
		}else{
			if(dna2[i] == undefined){
				dna.push(rand(0,5));
			}else{
				dna.push(dna2[i]);
			}
		}	
	}

	dna.push(rand(0,5));
	
	return dna;
}

function startStop(){
	if(started == false){
		app = setInterval(checkCells,100);		
		started = true;
	}else{
		clearInterval(app);
		started = false;
	}
}

function buildAllCells(ctx, h,w,r){
	for(var i=0; i< w/r; i++){
		cells[i] = new Array(h/r);
		for(var j=0; j< h/r; j++){
			cells[i].push( new Automato(ctx, i*r, j*r, r, false) );
		}
	}
}

function resetAllCells(){
	for(var i=0; i< cells.length; i++){
		for(var j=0; j< cells[i].length; j++){
			cells[i][j].alive = false;
			cells[i][j].create(i,j);
		}
	}
}

function checkCells(){
	actions++;
	var fitMax = undefined;
	var fitMin = undefined;
	var actors = new Array();

	for(var i=0; i< matrix.length; i++){
		for(var j=0; j< matrix[i].length; j++){
			if(matrix[i][j] != undefined && matrix[i][j].isAlive()){

				if(actions < maxActions){
					matrix[i][j].move();	
				}else{
					
					var fit = fitValue(matrix[i][j]);
					matrix[i][j].fit = fit;
					if(fitMin == undefined){
						fitMin = fit;	
					}else if(fitMin > fit){
						fitMin = fit;
					}

					if(fitMax == undefined){
						fitMax = fit;	
					}else if(fitMax < fit){
						fitMax = fit;
					}	

					actors.push(matrix[i][j]);				
				}
				
			}
		}
	}

	if(actions > maxActions){
		var m = fitMax - fitMin;
		var p = (5*m)/100;

		for(var i=0; i< actors.length; i++){
			var actor = actors.pop();
				
			if(actor.fit > fitMax-p){
				actor.alive = false;
				actor.clear();
			}else{
				actor.dna_indx = 0;
			}
		}

		actions = 0;
		generation++;
		bornCells();
	}
}

function rand(start, end){
	return Math.floor(Math.random() * end) + start;
}

function randBoolean(limit){
	var str = md5(Math.floor(Math.random()*100)+"");
	str = str.substring(28);

	var d = parseInt(str, 16);
	var d = d%100;
	if(d < limit){
		return true;
	}else{
		return false;	
	} 
	//return Math.round(Math.random()) == 0;
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawGrid(ctx,r, w, h){
	ctx.strokeStyle = "#eee";
	for(var i=0;i<w+1;i=i+r){
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,h);
		ctx.stroke();
	}

	for(var i=0;i<h+1;i=i+r){
		ctx.beginPath();
		ctx.moveTo(0,i);
		ctx.lineTo(w,i);
		ctx.stroke();
	}
}


function fitValue(actor){
	// actors should reach the 0,0 position;
	var x = actor.x;
	var y = actor.y;

	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
}