var cells = [[]];

class Automato {

	constructor(ctx, x, y, r, alive){
		this.ctx = ctx;
		this.x = x;
		this.y = y;
		this.r = r;
		this.alive = alive;
	};

	isAlive(){
		return this.alive;
	};

	kill(n){
		if(this.alive && (n < 2 || n > 3) ){
			this.alive = false;
		}else if(n == 3){
			this.alive = true;
		}
	};

	draw(x,y){
		if(this.alive){
			this.ctx.fillStyle = "#000000";
		}else{
			this.ctx.fillStyle = "#ffffff";
		}
		
		this.ctx.fillRect(y*this.r,x*this.r,this.r,this.r);
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
	var ctxw = width -4;
	var ctxh = height -4;

	$("#universe").attr("width", width -4);
	$("#universe").attr("height", height -4);

	var ctx = scene.getContext("2d");

	var r = 10;
	buildAllCells(ctx,ctxh, ctxw, r);
	for(var i=0; i< ctxh/r; i++){
		cells[i] = new Array();
		for(var j=0; j<ctxw/r; j++){
			var x = j*r;
			var y = i*r;
			var a = new Automato(ctx, x, y, r, randBoolean());
			a.draw(i,j);
			cells[i].push(a);
		}
	}

	// cells[0] = new Array();
	// cells[1] = new Array();
	// //cells[2] = new Array();

	// var p = 20;

	//  cells[0+p][0+p] = new Automato(ctx, 0*r, 0*r, r, false) ;
	//  cells[0+p][1+p] = new Automato(ctx, 1*r, 0*r, r, false) ;
	//  cells[0+p][2+p] = new Automato(ctx, 2*r, 0*r, r, true) ;
	//  cells[1+p][0+p] = new Automato(ctx, 0*r, 1*r, r, true) ;
	//  cells[1+p][1+p] = new Automato(ctx, 1*r, 1*r, r, false) ;
	//  cells[1+p][2+p] = new Automato(ctx, 2*r, 1*r, r, true);

	//  cells[2+p][0+p] = new Automato(ctx, 0*r, 2*r, r, false) ;
	//  cells[2+p][1+p] = new Automato(ctx, 1*r, 2*r, r, true) ;
	//  cells[2+p][2+p] = new Automato(ctx, 2*r, 2*r, r, true) ;

	//  for(var i=0; i< cells.length; i++){
	// 	for(var j=0; j< cells[i].length; j++){
	// 		cells[i][j].draw(j,i);
	// 	}
	// }

	//setInterval(checkCells,100);

	document.addEventListener("click",function(e,k){
		checkCells();
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

			c.kill(neighborhood);

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

function randBoolean(){
	return Math.round(Math.random()) == 0;
}