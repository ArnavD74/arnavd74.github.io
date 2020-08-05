var myVar = setInterval(function () {
    myTimer();
}, 0);

function myTimer() {
    var d = new Date();

    var h = d.getHours();
    var m = d.getMinutes();

    var mid = 'AM';
    if (h == 0) { //At 00 hours we need to show 12 am
        h = 12;
    } else if (h > 12) {
        h = h % 12;
        mid = 'PM';
    }

    var time = h + ":" + m + " " + mid

    document.getElementById("clock").innerHTML = time;
}