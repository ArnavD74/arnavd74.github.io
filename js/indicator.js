//By Wingo206
var ccanvas = document.getElementById("scroll-canvas");
var cctx = ccanvas.getContext("2d");
var ccw = 0;
var cch = 0;
var image = document.getElementById("chevron_down");

var globalHeight = -15;
var separationDistance = 50;
var startFrameDifference = 10;
var speed = 100;
var arrows = [];
setup();

function setup () {
    ccw = ccanvas.clientWidth;
    cch = ccanvas.clientHeight;
    /*
    arrows.push(new arrow(0,0,ccw,30,20,100,0));
    arrows.push(new arrow(0,40,ccw,30,20,100,10));
    arows.push(new arrow(0,80,ccw,30,20,100,20));
    */
    for (var i = 0; i < 1; i++) { //number of arrows
        arrows.push(new arrow(0,globalHeight+i*separationDistance, ccw, 20, speed, i*startFrameDifference));
    }
}

function update () {
    
    cctx.clearRect(0,0,ccw,cch);
    //VV bounding box for testing
    /* cctx.lineWidth = 2;
    cctx.strokeStyle = "#ffffff";
    cctx.fillStyle = "#ffffff";
    cctx.beginPath();
    cctx.rect(0,0,ccw, cch);
    cctx.stroke();*/
    //
    for (var i = 0; i < arrows.length; i++) {
        arrows[i].update();
        arrows[i].draw();
    }
}

var interval = setInterval(update, 1000/30);

function arrow (startX, startY, width, shift, interval, startFrame) {
    this.startX = startX;//the "top" position, counting from the top left of the bounding box of the image
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.w = width;
    this.shift = shift;
    this.interval = interval;//the amount of frames needed to cycle completely from top to bottom to top again
    this.curFrame = 0;
    this.startFrame = startFrame;
    this.update = function () {
        //this.y++;
        this.curFrame++;
        if (this.curFrame > interval) {
            this.curFrame = 0;
        }
        this.y = this.startY + -1*(this.shift/2)*Math.cos((Math.PI/(this.interval/2))*(this.curFrame - this.startFrame))+(this.shift/2);
    }
    this.draw = function () {
            /*cctx.beginPath();
            cctx.rect(this.x,this.y,this.w,this.h);
            cctx.stroke();*/
            cctx.drawImage(image,this.x, this.y,this.w,this.w);
    }
}