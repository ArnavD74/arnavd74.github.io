$(window).on('load', function () {
    window.countFPS = (function () {
        var lastLoop = (new Date()).getMilliseconds();
        var count = 1;
        var fps = 0;
        return function () {
            var currentLoop = (new Date()).getMilliseconds();
            if (lastLoop > currentLoop) {
                fps = count;
                count = 1;
            }
            else {
                count += 1;
            }
            lastLoop = currentLoop;
            return fps;
        };
    }());
    var $out =$('#out');
    (function loop() {
        requestAnimationFrame(function () {
            $out.html(countFPS());
            loop();
        });
    }());
});