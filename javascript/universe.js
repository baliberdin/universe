var t = 0;

class Vector {
	constructor(x1,y1,x2,y2){
		if(x1 != undefined && y1 != undefined && x2 != undefined && y2 != undefined){
			this.x = x2-x1;
			this.y = y2-y1;	
		}else if(x1 != undefined && y1 != undefined){
			this.x = x1;
			this.y = y1;
		}else{
			throw {error:-2, message: "Vector must be built from 2 coordinates (x,y) or 4 (x1,y1,x2,y2)"};
		}
		
	};

	static product(v1,v2){
		if(v1.constructor === Vector && v2.constructor === Vector){
			return new Vector(v1.x*v2.x, v1.y*v2.y);
		}else{
			throw {error:-1,message: "v1 or v2 is not a Vector."};
		}
	};

	static modulusProduct(v,m){
		if(v.constructor === Vector){
			return new Vector(v.x*m, v.y*m);
		}else{
			throw {error:-1,message: "v1 or v2 is not a Vector."};
		}
	};

	static resultant(vList){
		if(vList.constructor === Array){
			var v = new Vector(0,0);

			for(var i=0;i<vList.length; i++){
				if(vList[i].constructor === Vector){
					v = Vector.sum(v,vList[i]);
				}else{
					throw {error:-4,message:"Array List element["+i+"] is not a Vector"};
				}
			}

			return v;

		}else{
			throw {error:-3,message:"vList parameter is not a Array of Vectors"}
		}

		if(v1.constructor === Vector && v2.constructor === Vector){
			return new Vector(v1.x+v2.x, v1.y+v2.y);
		}else{
			throw {error:-1,message: "v1 or v2 is not a Vector."};
		}
	};

	static sum(v1,v2){
		if(v1.constructor === Vector && v2.constructor === Vector){
			return new Vector(v1.x+v2.x, v1.y+v2.y);
		}else{
			throw {error:-1,message: "v1 or v2 is not a Vector."};
		}
	};

	static modulus(v){
		if(v.constructor === Vector){
			var m = Math.sqrt( Math.pow(v.x,2) + Math.pow(v.y,2));
			if(m < 0)m = m* -1;
			return m;
		}else{
			throw {error:-1,message: "v is not a Vector."};
		}
	};

  /** Scalar Product of two Vectors **/
	static scalarProduct(v1,v2){
		if(v1.constructor === Vector && v2.constructor === Vector){
			return (v1.x*v2.x + v1.y*v2.y);
		}else{
			throw {error:-1,message: "v1 or v2 is not a Vector."};
		}
	};

  /** Constructor of a new Vector with modulus 1 with same direction**/
	static unitVector(v){
		if(v.constructor === Vector){
			return new Vector(v.x/Vector.modulus(v), v.y/Vector.modulus(v));
		}else{
			throw {error:-1,message: "v is not a Vector."};
		}
	};
}

class Particle {
	
	constructor(id){
		this.id = id;
		this.inertia = new Vector(0,0);
		this.velocity = 0;
	};

	equalsTo(p){
		return p.id == this.id;
	}

	draw(){
		if(this.r < 5){
			this.ctx.fillStyle = "#888888";
		}else if(this.r < 10){
			this.ctx.fillStyle = "#444444";
		}else{
			this.ctx.fillStyle = "#000000";
		}
		
		if(this.r > 3){
			this.ctx.beginPath();
		  this.ctx.arc(this.w,this.h,this.r,0,2*Math.PI);
		  this.ctx.fill();
		}else{
			this.ctx.fillRect(this.w,this.h,this.r,this.r);
		}

		this.old_w = this.w;
		this.old_h = this.h;

		this.ctx.strokeStyle = "#ff0000";
		this.ctx.lineWidth=1;
		this.ctx.beginPath();
		this.ctx.moveTo(this.w, this.h);
		var lv = Vector.unitVector(this.inertia);
		this.ctx.lineTo(this.w + lv.x*this.r*2, this.h + lv.y*this.r*2);
		this.ctx.stroke();
	};

	force(){
		// if(this.inertia != undefined){
		// 	return this.charge * Vector.modulus(this.inertia);	
		// }else{
			return this.charge;
		//}
		
	};

	setLocation(w,h){

	};
}

var particles = [];


$(document).ready(function(){
	var scene = document.getElementById("universe");

	var width = window.innerWidth;
	var height = window.innerHeight;

	$("#universe").attr("width", width -4);
	$("#universe").attr("height", height -4);

	var ctx = scene.getContext("2d");

	for(var i=0;i<1000;i++){

		var p = new Particle(i);
		
		if(i%200 == 0){
			p.r = Math.floor(Math.random()*(20-8) + 10);			
			p.charge = p.r*0.006;
		 }else{
		 	p.r = Math.floor(Math.random()*(7-3) + 3);
		 	p.charge = p.r * 0.00001;	
		 }

		do{
			p.w = getRandomW();
			p.h = getRandomH();
		}while(existsParticle(p));

		p.ctx = ctx;
		particles.push(p);	
	}

	setInterval(gravityAction,80);
	//setInterval(info,1000);
});

function getRandomW(){
	var width = window.innerWidth;
	var wInit = 0;
	var wEnd = width;
	return Math.floor(Math.random() * (wEnd - wInit) + wInit);
}

function getRandomH(){
	var height = window.innerHeight;
	var hInit = 0;
	var hEnd = height;
	return Math.floor(Math.random() * (hEnd - hInit) + hInit);
}

function existsParticle(p){
	var treshold = 20;
	for(var i =0; i<particles.length;i++){
		var v = new Vector(p.w,p.h, particles[i].w, particles[i].h);
		if(Vector.modulus(v) < treshold) return true;
	}
	return false;
}

function info(){
	//for(var i=0; i<particles.length; i++){
		//console.log(particles[0].inertia);
	//}
}

function gravityAction(){
	var scene = document.getElementById("universe");
	var ctx = scene.getContext("2d");
	ctx.clearRect(0,0, scene.width, scene.height);
	t=t+0.5;
	for(var i=0;i<particles.length; i++){
		var p = particles[i];
		var vForce = calculateForces(p);

		if(p.inertia != undefined){
			p.inertia = Vector.sum(p.inertia,vForce);	
		}else{
			p.inertia = vForce;
		}
		
		calculateDisplacement(p);
	}
}

function calculateForces(p){
	var distances = [];
	var vForces = [];

	for(var i=0;i<particles.length; i++){
		var pd = particles[i];
		if(pd.id == p.id)continue;
		
			// var vDistance = new Vector(p.w, p.h, pd.w, pd.h);
			// var force = 9 * ((p.force()*pd.force())/Math.pow(Vector.modulus(vDistance),2));
			// var vForce = Vector.modulusProduct(Vector.unitVector(vDistance),force);
			var vf = calculateForcesBetweenParticles(p,pd);
			if(vf != undefined){
				vForces.push(vf);
			}
	}

	return Vector.resultant(vForces);
}

function calculateForcesBetweenParticles(p1,p2){
	var vDistance = new Vector(p1.w, p1.h, p2.w, p2.h);
	var mDistance = Vector.modulus(vDistance);
	var force = 0;
	if(mDistance < 0.0001){
		force = 9 * ((p2.force())/Math.pow(1,2));
	}else{
		force = 9 * ((p2.force())/Math.pow(mDistance,2));
	}
	//var force = 9 * ((p1.force()*p2.force())/Math.pow(Vector.modulus(vDistance),2));
	//var force = 9 * ((p2.force())/Math.pow(Vector.modulus(vDistance),2));
	//if(force < 0.0000001)return undefined;
	return Vector.modulusProduct(Vector.unitVector(vDistance),force);
}

function calculateDisplacement(p){
	var s = p.velocity*t + 0.5 * Vector.modulus(p.inertia) * (t*t); // + (p.r*0.005);

	var displacement = Vector.modulusProduct(Vector.unitVector(p.inertia), s);

	if(false){
		for(var i=0;i<particles.length; i++){
			var pd = particles[i];
			if(p.id == pd.id)continue;

			var vpd = new Vector(p.w, p.h, pd.w, pd.h);

			// If particles are close enough to colide
			if(Vector.modulus(vpd) <= (pd.r + p.r) ){
				//console.log(Vector.modulus(vpd));

				//if(p.inertia != undefined && pd.inertia != undefined){
					// var pfs = [];
					// var pdfs = [];

					// pfs.push(p.inertia);
					// pfs.push(calculateForcesBetweenParticles(p,pd));
					// p.inertia = Vector.resultant(pfs);

					// pdfs.push(pd.inertia);
					// pdfs.push(calculateForcesBetweenParticles(pd,p));
					// pd.inertia = Vector.resultant(pdfs);					

						p.inertia = Vector.sum(p.inertia, Vector.modulusProduct(pd.inertia, -1));
						pd.inertia = Vector.sum(pd.inertia, Vector.modulusProduct(p.inertia, -1));
				//}

				// if(p.inertia != undefined){
				// 	p.inertia = Vector.modulusProduct(p.inertia, -1);

				// 	if(pd.inertia != undefined){
				// 		pd.inertia = Vector.modulusProduct(pd.inertia, -1);
				// 	}
				// 	// }else{
				// 	// 	pd.inertia = Vector.modulusProduct(p.inertia,-1);
				// 	// }

				// }
				// //break;
			}
		}

	}

	var displacement = Vector.modulusProduct(Vector.unitVector(p.inertia), s/4);	
	p.w = p.w + displacement.x;
	p.h = p.h + displacement.y;
	p.draw();
}


