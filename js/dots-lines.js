var home = document.getElementById("home");
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var cw = 0;
var ch = 0;
var dots = [];
var dotCount = 200;
var connectionDistance = 100;
var maxSize = 10;
var minSize = 2;
var minTransparency = 0.5;
var maxTransparency = 1;
var motionBlur = 1;
var fadeOut = 50;
var maxSpeed = 2;
var mx = -1000;
var my = -1000;
var repelFactor = 10000000;
var maxAccel = 5;
var friction = 0.90;
var pullFactor = 1000000;
var pullDistance = 100;
var mouseDown = false;
setup();
function setup () {
	//set the starting size
	onresize();
	for (var i = 0; i < dotCount; i++) {
		dots.push(new dot());
	}
	home.addEventListener("mousemove", onMouseMove, true);
	c.addEventListener("mousemove", onMouseMove, true);
	home.addEventListener("mousedown", onMouseDown, true);
	c.addEventListener("mousedown", onMouseDown, true);
	home.addEventListener("mouseup", onMouseUp, true);
	c.addEventListener("mouseup", onMouseUp, true);
}

function onMouseMove (e) {
	mx = e.clientX;
	my = e.clientY+document.documentElement.scrollTop;
} 
function onMouseDown (e) {
	console.log("a");
	mouseDown = true;
}
function onMouseUp (e) {
	console.log("a");
	mouseDown = false;
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
	for (var i = 0; i < dots.length; i++) {
		dots[i].draw();
	}
}

var interval = setInterval(update, 1000/30);

function dot () {
	this.r = minSize + Math.random()*maxSize;
	this.x = Math.round(Math.random()*cw);
	this.y = Math.round(Math.random()*ch);
	this.xvel = maxSpeed * (Math.random() * 2  - 1);
	this.yvel = maxSpeed * (Math.random() * 2 - 1);
	this.t = minTransparency + Math.random()*maxTransparency;
	this.applyForce = function (angle, force) {
		this.x += Math.cos(angle) * force;
		this.y += Math.sin(angle) * force;
	}
	this.update = function () {
		//move
		this.x += this.xvel;
		this.y += this.yvel;
		if (!mouseDown) {
			//repel from mouse
			var angle = getAngle(this.x, this.y, mx, my);
			var force = repelFactor/Math.pow(dist(this.x, this.y, mx, my), 3);
			if (force > maxAccel) {
				force = maxAccel;
			}
			this.applyForce(angle, -force);
		} else {
			//attract to mouse
			if (dist(this.x, this.y, mx, my) < pullDistance) {
				var angle = getAngle(this.x, this.y, mx, my);
				var force = pullFactor/Math.pow(dist(this.x, this.y, mx, my), 2);
					if (force > maxAccel * 5) {
						force = maxAccel*5;
					}
				this.applyForce(angle, force)
			}
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
		if (this.x < 0) {//x
			this.xvel *= -1;
			this.x = Math.abs(this.x);
		} else if (this.x > cw) {
			this.xvel *= -1;
			this.x = cw - (this.x-cw);
		}
		if (this.y < 0) {//y
			this.yvel *= -1;
			this.y = Math.abs(this.y);
		} else if (this.y > ch) {
			this.yvel *= -1;
			this.y = ch - (this.y-ch);
		}
	}
	this.draw = function () {
		//connections
		for (var i = 0; i < dots.length; i++) {
			var dot = dots[i];
			var distance = dist(this.x, this.y, dot.x, dot.y);
			if (distance <= connectionDistance+fadeOut) {
				var transparency = (getLower(this.t, dot.t))*2*sigmoid(-6/(2*fadeOut)*(distance-(connectionDistance+fadeOut)))-1;
				//ctx.globalAlpha = (getLower(this.t, cdot.t))*2*sigmoid(-6/(2*fadeOut)*(distance-(connectionDistance+fadeOut)))-1;
				ctx.strokeStyle = "rgba(255, 255, 255, "+transparency+")";
				ctx.lineWidth = getLower(this.r, dot.r)/4;
				ctx.beginPath();
				ctx.moveTo(this.x, this.y);
				ctx.lineTo(dot.x, dot.y);
				ctx.stroke();
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