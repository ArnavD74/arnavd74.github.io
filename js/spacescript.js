function earth() {
    window.location = "https://earth.google.com/web/@" + document.getElementById("copyPos").value +
        ",25.28438759a,500d,35y,0h,0t,0r";
}

function maps() {
    window.location.href = 'https://www.google.com/maps/search/?api=1&query=' + document.getElementById("copyPos").value;
}

var x = document.getElementById("getPos");  

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Error fetching coordinates. Please enable GPS.";
    }
}

function showPosition(position) {
    x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
    var rawPos = document.getElementById("copyPos");

    rawPos.value = position.coords.latitude + "," + position.coords.longitude;
}

function copyLocation() {
    var copyText = document.getElementById("copyPos");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
}

function changeText() {
    console.log("function started");
    var x = document.getElementById("copyLoc");
    console.log(x);
    if (x.innerHTML === "Copy Location") {
        x.innerHTML = "Copied!";
        console.log("copy successful");
    }
    console.log("copy unsuccessful");
}