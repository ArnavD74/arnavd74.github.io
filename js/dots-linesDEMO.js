//By Wingo206
var home = document.getElementById("home");
var c = document.getElementById("canvas");
var header = document.getElementById("header")
var ctx = c.getContext("2d");
var cw = 0;
var ch = 0;
var dots = [];
var dotCount = 225; //DOT COUNT
var connectionDistance = 110;
var maxSize = 7;
var minSize = 2;
var minTransparency = 0.25;
var maxTransparency = 0.82;
var motionBlur = 5;
var fadeOut = 50;
var maxSpeed = 2.5;
var mx = -1000;
var my = -1000;
var repelFactor = 10000000;
var maxAccel = 5;
var friction = 0.90;
var pullFactor = 18000;
var pullDistance = 100;
var attractionTimer = 0;
var pullLength = 10;
setup();
function setup () {
	//set the starting size
	onresize();
	var dotsPerPixel = dotCount/(1903*969);
	dotCount = cw*ch*dotsPerPixel;
	var sizePerPixel = pullFactor/(1903*969);
	pullFactor = ch*cw*sizePerPixel;
	console.log("balls: "+dotCount);
	for (var i = 0; i < dotCount; i++) {
		dots.push(new dot());
	}
	home.addEventListener("mousemove", onMouseMove, true);
	c.addEventListener("mousemove", onMouseMove, true);
	header.addEventListener("mousemove", onMouseMove, true);
	home.addEventListener("click", onMouseClick, true);
	c.addEventListener("click", onMouseClick, true);
	header.addEventListener("click", onMouseClick, true);
}

function onMouseMove (e) {
	mx = e.clientX;
	my = e.clientY+document.documentElement.scrollTop;
} 
function onMouseClick (e) {
	attractionTimer = pullLength;
	
}

function onresize () {
	cw = home.clientWidth;
	canvas.width = cw;
	ch = home.clientHeight;
	canvas.height = ch;
	update();
}

function update () {
	
	ctx.clearRect(0,0,cw,ch);
	for (var i = 0; i < dots.length; i++) {
		dots[i].update();
	}
	if (attractionTimer >= 0) {
		attractionTimer --;
	}
	for (var i = 0; i < dots.length; i++) {
		dots[i].draw();
	}
	//succ circle
	ctx.strokeStyle = "rgba(255, 255, 255, "+(3/(pullLength)*1/(attractionTimer))+")";
	//ctx.strokeStyle = "rgba(255, 255, 255, "+1+")";
	ctx.lineWidth = 10;
	ctx.beginPath();
	ctx.arc(mx, my, 3*(attractionTimer+1)**2, 0, Math.PI*2);
	ctx.stroke();
}

var interval = setInterval(update, 1000/30);

function dot () {
	this.r = minSize + Math.random()*maxSize;
	this.x = Math.round(Math.random()*cw);
	this.y = Math.round(Math.random()*ch);
	this.xvel = maxSpeed * (Math.random() * 2  - 1);
	this.yvel = maxSpeed * (Math.random() * 2 - 1);
	this.t = minTransparency + Math.random()*(maxTransparency-minTransparency);
	this.applyForce = function (angle, force) {
		this.x += Math.cos(angle) * force;
		this.y += Math.sin(angle) * force;
	}
	this.update = function () {
		//move
		this.x += this.xvel;
		this.y += this.yvel;
		
		if (attractionTimer <= 0) {
			//repel from mouse
			var angle = getAngle(this.x, this.y, mx, my);
			var force = repelFactor/Math.pow(dist(this.x, this.y, mx, my), 3);
			if (force > maxAccel) {
				force = maxAccel;
			}
			
			this.applyForce(angle, -force);
		} else {
			//attract to mouse
			var angle = getAngle(this.x, this.y, mx, my);
			var force = pullFactor/Math.pow(dist(this.x, this.y, mx, my), 2)*(attractionTimer+pullLength);
			if (force > 10*maxAccel) {
				force = maxAccel;
			}
			
			this.applyForce(angle, force);
		}
		//repel from each other
		for (var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			var distance = dist(this.x, this.y, dot.x, dot.y);
			var	minDist = this.r + dot.r;
			if (distance < minDist) {
				var angle = getAngle(this.x, this.y, dot.x, dot.y);
				var moveDistance = (minDist-distance)/2;
				this.applyForce(angle, -1*moveDistance);
				dot.applyForce(angle, 1*moveDistance);
			}
		}
		//bounce off walls
		if (this.x < -1*maxSize*2) {//x
			this.xvel *= -1;
			//this.x = -1*maxSize*2+(this.x+maxSize*2);
		} else if (this.x > cw+maxSize*2) {
			this.xvel *= -1;
			//this.x = (cw+maxSize*2) - (this.x-(cw+maxSize*2));
		}
		if (this.y < -1*maxSize*2) {//y
			this.yvel *= -1;
			//this.y = -1*maxSize*2+(this.y+maxSize*2);
		} else if (this.y > ch+maxSize*2) {
			this.yvel *= -1;
			//this.y = (ch+maxSize*2) - (this.y-(ch+maxSize*2));
		}
	}
	this.draw = function () {
		//connections
		for (var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			if (dot !== this) {
				var distance = dist(this.x, this.y, dot.x, dot.y);
				if (distance <= connectionDistance+fadeOut) {
					var transparency = this.t*2*sigmoid(-6/(2*fadeOut)*(distance-(connectionDistance+fadeOut)))-1;
					ctx.strokeStyle = "rgba(255, 255, 255, "+transparency+")";
					ctx.lineWidth = getLower(this.r, dot.r)/2;
					var angle = getAngle(this.x, this.y, dot.x, dot.y);
					var x1 = this.x + this.r*Math.cos(angle);
					var y1 = this.y + this.r*Math.sin(angle);
					var x2 = dot.x + -dot.r*Math.cos(angle);
					var y2 = dot.y + -dot.r*Math.sin(angle);
					ctx.beginPath();
					ctx.moveTo(x1, y1);
					ctx.lineTo(x2, y2);
					ctx.stroke();
				}
			}
		}
		//draw
		ctx.fillStyle = "rgba(255, 255, 255, "+this.t+")";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
		//ctx.drawImage(document.getElementById("image1"), this.x, this.y, this.r*10, this.r*10);
		ctx.fill();
	}
}
function dist (x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2));
}
function sigmoid (x) {
	return 1/(1+Math.pow(Math.E, -1*x))
}
function getAngle (x1, y1, x2, y2) {//angle from p1 to p2
	return Math.atan2(y2-y1, x2-x1);
}
function getLower (num1, num2) {
	if (num1 < num2) {
		return num1;
	} else {
		return num2;
	}
}