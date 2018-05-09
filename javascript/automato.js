var app;
var started = false;
var cells = [[]];


class Automato {

	constructor(ctx, x, y, r, alive){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.r = r;
		this.alive = alive;
		this.neighborhood = 0;
		this.color = "#000";
	};

	isAlive(){
		return this.alive;
	};

	checkNeighborhood(){
		if(this.alive && (this.neighborhood < 2 || this.neighborhood > 3) ){
			this.alive = false;
		}else if(this.neighborhood == 3){
			this.alive = true;
		}
	};

	create(x,y){
		//this.checkNeighborhood();
		if(this.alive){
			this.ctx.fillStyle = this.color;
		}else{
			this.ctx.fillStyle = "#ffffff";
		}
		
		this.ctx.fillRect(y*this.r+1,x*this.r+1,this.r-2,this.r-2);
		this.ctx.fill();
	};

	draw(x,y){
		this.checkNeighborhood();
		if(this.alive){
			this.ctx.fillStyle = this.color;
		}else{
			this.ctx.fillStyle = "#ffffff";
		}
		
		this.ctx.fillRect(y*this.r+1,x*this.r+1,this.r-2,this.r-2);
		this.ctx.fill();
	}

	alert(){
		if(this.alive){
			this.ctx.fillStyle = "#ff0000";
		}else{
			this.ctx.fillStyle = "#ffffff";
		}
		
		this.ctx.fillRect(y*this.r,x*this.r,this.r,this.r);
		this.ctx.fill();
	}
}

$(document).ready(function(){
	var scene = document.getElementById("universe");

	var width = window.innerWidth;
	var height = window.innerHeight;
	var r = 5;

	//var ctxw = width;
	var ctxw = Math.floor(width/r)*r;
	//var ctxh = height;
	var ctxh = Math.floor(height/r)*r;
	
	$("#universe").attr("width", ctxw);
	$("#universe").attr("height", ctxh);

	var ctx = scene.getContext("2d");
	drawGrid(ctx,r, ctxw, ctxh);
	
	var rainbow = new Rainbow();
	rainbow.setNumberRange(0, 100);
	rainbow.setSpectrum('black', 'red', 'orange', 'yellow');

	buildAllCells(ctx,ctxh, ctxw, r);
	for(var i=0; i< ctxh/r; i++){
		cells[i] = new Array();
		for(var j=0; j<ctxw/r; j++){
			var x = j*r;
			var y = i*r;
			var a = new Automato(ctx, x, y, r, randBoolean(20));
			a.create(i,j);
			cells[i].push(a);
		}
	}

	window.addEventListener("keydown",function(e,k){
		if(e.keyCode == 13){

			if(started == false){
				app = setInterval(checkCells,200);		
				started = true;
			}else{
				clearInterval(app);
				started = false;
			}
		}
	});
	
});

function buildAllCells(ctx, h,w,r){
	for(var i=0; i< h/r; i++){
		cells[i] = new Array();
		for(var j=0; j< w/r; j++){
			cells[i].push( new Automato(ctx, j*r, i*r, r, false) );
		}
	}
}

function checkCells(){
	for(var i=0; i< cells.length; i++){
		for(var j=0; j< cells[i].length; j++){

			var c = cells[i][j];
			var neighborhood = 0;

			// superior
			if(i > 0){
				if(cells[i-1][j].alive) neighborhood++;
			}

			// abaixo
			if(i < cells.length-1){
				if(cells[i+1][j].alive) neighborhood++;
			}

			// esquerdo
			if(j > 0){
				if(cells[i][j-1].alive) neighborhood++;
			}

			// direito
			if( j < cells[i].length -1){
				if(cells[i][j+1].alive) neighborhood++;
			}

			// superior esquerdo
			if(i>0 && j> 0){
				if(cells[i-1][j-1].alive) neighborhood++;
			}

			// superior direita
			if(i>0 && j< cells[i].length-1){
				if(cells[i-1][j+1].alive) neighborhood++;
			}

			// inferior esquerdo
			if(i<cells.length-1 && j > 0){
				if(cells[i+1][j-1].alive) neighborhood++;
			}

			// inferior direito
			if(i<cells.length-1 && j < cells[i].length-1){
				if(cells[i+1][j+1].alive) neighborhood++;
			}

			c.neighborhood = neighborhood;

			//console.log("m:"+i+" n:"+j+" v:"+neighborhood);
		}
	}

	for(var i=0; i< cells.length; i++){
		for(var j=0; j< cells[i].length; j++){
			cells[i][j].draw(i,j);
		}
	}
}

function rand(start, end){
	return Math.floor(Math.random() * (end - start) + end);
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
	ctx.strokeStyle = "#bbb";
	for(var i=0;i<w;i=i+r){
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,h);
		ctx.stroke();
	}

	for(var i=0;i<h;i=i+r){
		ctx.beginPath();
		ctx.moveTo(0,i);
		ctx.lineTo(w,i);
		ctx.stroke();
	}
}
