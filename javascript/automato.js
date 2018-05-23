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
		}else if(this.neighborhood == 3 && !this.alive){
			this.alive = true;
			this.color = "#cc5555";
		}else if(this.isAlive){
			this.color = "#000000";
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
	};

	// alert(){
	// 	if(this.alive){
	// 		this.ctx.fillStyle = "#ff0000";
	// 	}else{
	// 		this.ctx.fillStyle = "#ffffff";
	// 	}
		
	// 	this.ctx.fillRect(y*this.r,x*this.r,this.r,this.r);
	// 	this.ctx.fill();
	// };

	revert(x,y){
		if(this.alive){
			this.alive = false;
		}else{
			this.alive = true;
		}

		this.create(x,y);
	}
}

$(document).ready(function(){
	var scene = document.getElementById("universe");

	var width = window.innerWidth/6*4;
	var height = window.innerHeight/5*4;
	var r = 10;

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
	buildRandomCells();

	window.addEventListener("keydown",function(e,k){
		if(e.keyCode == 13){
			startStop();
		}
	});

	scene.addEventListener("click",function(e,k){
		//console.log(e);
		var x = Math.floor(e.layerX/r);
		var y = Math.floor(e.layerY/r);

		cells[y][x].revert(y,x);

		// console.log(x);
		// console.log(y);
	});

	$("#bt_mode").click(function(){
		if($(this).attr("data-mode") == "manual"){
			$("#bt_mode").html("Manual");
			$(this).attr("data-mode","auto");
			console.log("modo auto");
			buildRandomCells();

		}else{
			$("#bt_mode").html("Auto");	
			$(this).attr("data-mode","manual");
			console.log("modo manual");
			clearInterval(app);
			started = false;
			resetAllCells();
		}
	});
	
});

function buildRandomCells(){
	for(var i=0; i< cells.length; i++){
		for(var j=0; j<cells[i].length; j++){
			cells[i][j].alive = randBoolean(20);
			cells[i][j].create(i,j);
		}
	}
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
	for(var i=0; i< h/r; i++){
		cells[i] = new Array();
		for(var j=0; j< w/r; j++){
			cells[i].push( new Automato(ctx, j*r, i*r, r, false) );
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
