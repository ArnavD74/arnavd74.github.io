//By Wingo206
var ccanvas = document.getElementById("scroll-canvas");
var cctx = ccanvas.getContext("2d");
var ccw = 0;
var cch = 0;

var arrows = [];
setup();

function setup () {
    ccw = ccanvas.clientWidth;
    cch = ccanvas.clientHeight;
    arrows.push(new arrow(0,0,ccw,30,20,100,0));
    arrows.push(new arrow(0,40,ccw,30,20,100,10));
    arrows.push(new arrow(0,80,ccw,30,20,100,20));
}

function update () {
    cctx.clearRect(0,0,ccw,cch);
    //VV bounding box for testing
    cctx.lineWidth = 2;
    cctx.font = "20px Arial"
    cctx.strokeStyle = "#ffffff";
    cctx.fillStyle = "#ffffff";
    cctx.beginPath();
    cctx.rect(0,0,ccw, cch);
    cctx.stroke();
    cctx.fillText("Need", 0,80);
    cctx.fillText("arrow", 0,100);
    cctx.fillText("images", 0,120);
    for (var i = 130; i < 170; i+=5) {
        cctx.fillText("reeeeeeeeeee", i-130,i);
    }
    //
    for (var i = 0; i < arrows.length; i++) {
        arrows[i].update();
        arrows[i].draw();
    }
}

var interval = setInterval(update, 1000/30);

function arrow (startX, startY, width, height, shift, interval, startFrame) {
    this.startX = startX;//the "top" position, counting from the top left of the bounding box of the image
    this.startY = startY;
    this.x = startX;
    this.y = startY;
    this.w = width;
    this.h = height;
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
            cctx.beginPath();
            cctx.rect(this.x,this.y,this.w,this.h);
            cctx.stroke();
    }
}