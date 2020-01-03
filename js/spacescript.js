
function earth() {
  window.location.href = "https://earth.google.com/web/@" + document.getElementById("search").value +
    ",25.28438759a,500d,35y,0h,0t,0r";
}

function maps() {
  window.location.href = "https://www.google.com/maps/search/?api=1&query=" + document.getElementById("search").value;
}
