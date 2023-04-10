// Java Script file to load all data on a map
// Python Flask server provide site server and post method to download data from MongoDB database
// Two options: 1. local server (using: http://127.0.0.1:5000), 2. server hosted on web

// Load map:
// Set map main point (current: Poland)
var map = L.map('map').setView([52.0306978708904, 19.479774125612348], 6);

// Load map tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://github.com/M-Malek">Created by: M. Malek</a>'
}).addTo(map);

// Load data from database
let url="http://127.0.0.1:5000/data";
fetch(url) // fetch data from flask api response
.then(result => result.json()) // set data as .json file
.then(json => func_load_points_on_map(json['data'], json['data'].length)) // run function to set all points on a map

//Function to load points on a map
function func_load_points_on_map(json, rowCount){
  // Load all points on a map
  console.table(json);  //debug: see data table

  // For loop: setting all points on a map -> current staatus: bug: the first element was not shown on the map
  for (let i = 0; i < (rowCount); i++){
    var name = json[i]['name'];
    var owner = json[i]['owner'];
    var type = json[i]['type'];
    var power = json[i]['power'];
    var latitiude = parseInt(json[i]['lat'], 10);
    var longitiude = parseInt(json[i]['lng'], 10);
    const text = `
    ${name} </br> 
    Typ: ${type} </br>
    Moc: ${power} MW </br>
    Właściciel: ${owner}
    `;
    console.log(text);
    func_load_point(latitiude, longitiude, text, type);
  }
}

// Load all points from database to a map:
// Step 1: create custom icons for power plants: -> wprk in progress
//var windpowerIcon = L.icon();

// Step 2: function for automatically adding points to the map
function func_load_point(lng, lat, popupText, type){
  if (type == ""){

  }
  else if (type == ""){

  }
  else{
    var marker = L.marker([lng, lat]).addTo(map);
    marker.bindPopup(popupText);
    console.log(`Setting point with description ${popupText}`);
  }
    // var marker = L.marker([lng, lat]).addTo(map);
    // marker.bindPopup(popupText);
    // console.log(`Setting point with description ${popupText}`);
}

// Step 2: for loop to parse all points on a map
func_load_points_on_map()

// Step 3: add all power plants to a list in aside tag
// work in progress after fixing a bug with map


// Advanced searching for an object:
