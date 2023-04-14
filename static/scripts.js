// Java Script file to load all data on a map
// Python Flask server provide site server and post method to download data from MongoDB database
// Two options: 1. local server (using: http://127.0.0.1:5000), 2. server hosted on web

//Main database URL:
const dbURL = "http://127.0.0.1:5000/";

// Load map:
// Set map main point (current: Poland)
var map = L.map('map').setView([52.0306978708904, 19.479774125612348], 6);

// Load map tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://github.com/M-Malek">Created by: M. Malek</a>'
}).addTo(map);

// Load data from database
//Function to load data and points on map
function func_load_map_data(){
  let url=`${dbURL}data`;
fetch(url) // fetch data from flask api response
.then(result => result.json()) // set data as .json file
.then(json => func_load_points_on_map(json['data'], json['data'].length)) // run function to set all points on a map
}

//Function to load points on a map
//List with all objects name
let allObjects = [];

function func_load_points_on_map(json, rowCount){
  // Load all points on a map
  console.table(json);  //debug: see data table

  // For loop: setting all points on a map -> current staatus: bug: the first element was not shown on the map
  for (let i = 0; i < (rowCount); i++){
    var name = json[i]['name'];
    var owner = json[i]['owner'];
    var type = json[i]['type'];
    var power = json[i]['power'];
    var latitiude = parseFloat(json[i]['lat']);
    var longitiude = parseFloat(json[i]['lng']);
    const text = `
    ${name} </br> 
    Typ: ${type} </br>
    Moc: ${power} MW </br>
    Właściciel: ${owner}
    `;
    //console.log(text);
    allObjects.push(name);
    func_load_point(latitiude, longitiude, text, type);
  }
}

// Load all points from database to a map:
// Step 1: create custom icons for power plants:
var windpowerIcon = L.icon({
  iconUrl: "static/wind-turbine.png",
  iconSize: [16, 16]
});

var photovoltaicIcon = L.icon({
  iconUrl: "static/solar-panel.png",
  iconSize: [16, 16]
})

// Step 2: function for automatically adding points to the map
function func_load_point(lng, lat, popupText, type){
  if (type == "elektrownia fotowoltaiczna"){
    var marker = L.marker([lng, lat], {icon: photovoltaicIcon}).addTo(map);
    marker.bindPopup(popupText);
    //console.log(`Setting point with description ${popupText}`);
  }
  else if (type == "elektrownia wiatrowa"){
    var marker = L.marker([lng, lat], {icon: windpowerIcon}).addTo(map);
    marker.bindPopup(popupText);
    //console.log(`Setting point with description ${popupText}`);
  }
  else{
    var marker = L.marker([lng, lat]).addTo(map);
    marker.bindPopup(popupText);
    //console.log(`Setting point with description ${popupText}`);
  }
}

//Map loading
//Step 1: Load map and data
func_load_map_data();

// Step 2: for loop to parse all points on a map
func_load_points_on_map()

//Zooming on point of user choosing:
//Check which element has been clicked -> if it's element from power plants list, zoom on it
window.onclick = e => {
  if (e.target.getAttribute("data-value"))
  {
    const powerPlantName = e.target.getAttribute("data-value");
    //console.log(powerPlantName); //debug
    let zoomURL = `${dbURL}zoom?name=${powerPlantName}`;
    console.log(zoomURL);
    fetch(zoomURL)
    .then(data => data.json())
    .then(json => func_zoom_map(json['data']))
  }
}  


//Zoom on clicked power plant from power plants list in aside tag:
function func_zoom_map(data){
  var latitiude = parseFloat(data['lat']);
  var longitiude = parseFloat(data['lng']);
  // console.log(latitiude, longitiude);
  map.remove();
  map = L.map('map').setView([latitiude, longitiude], 17);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://github.com/M-Malek">Created by: M. Malek</a>'
  }).addTo(map);
  func_load_map_data();
}


// Advanced searching for an object:
// Use AJAX: https://www.w3schools.com/js/js_ajax_intro.asp
function func_start_searching(){
   //Read search parameters and send request to server
}

function func_ask_for_search(){
  //Parse data from server, reload aside bar with
}


