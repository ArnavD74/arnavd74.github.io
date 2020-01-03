function earth() {
    window.location.href = "https://earth.google.com/web/@" + document.getElementById("search").value +
        ",25.28438759a,500d,35y,0h,0t,0r";
}

function maps() {
    window.location.href = "https://www.google.com/maps/search/?api=1&query=" + document.getElementById("search").value;
}

var x = document.getElementById("getPos");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "100,100";
    }
}

function showPosition(position) {
    x.innerHTML = position.coords.latitude + "," + position.coords.longitude +
        "<br><font color=white> Enter below! <i>(as a single line)</i></font>";
    
    console.log("initiated, coordinates successfully grabbed");

    var rawPos = document.getElementById("copyPos");

    console.log("yeet captured as copyLocation");

    rawPos.value = position.coords.latitude + "," + position.coords.longitude;
}

function copyLocation() {
    var copyText = document.getElementById("copyPos");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
}