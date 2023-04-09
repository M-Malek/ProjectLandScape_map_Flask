//Conect to MongoDB database

// Load data from database in MongoDB

const testText = "EOP <br> Siedziba główna firmy <br> Dalszy tekst";

var map = L.map('map').setView([52.41455446101228, 16.943874735534624], 13);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

func_loadpoint(52.40959998290446, 16.967171156160187, testText);

function func_loadpoint(lng, lat, popupText){
    var marker = L.marker([lng, lat]).addTo(map);
    marker.bindPopup(popupText);
}
