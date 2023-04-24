// Java Script file to load all data on a map
// Python Flask server provide site server and post method to download data from MongoDB database
// Two options: 1. local server (using: http://127.0.0.1:5000), 2. server hosted on web

//Main database URL:
const dbURL = "http://127.0.0.1:5000/";
let allObj = 0;

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
    allObj = rowCount;
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
document.getElementById('button_srch').onclick = function() {
  func_start_searching();
};

function func_start_searching(){
   //Read search parameters and send request to server
   console.log("Szukam!");
   let name = document.getElementById('srch_powerplant_name').value;
   let owner = document.getElementById('srch_powerplant_owner').value;
   let power = document.getElementById('srch_powerplant_power').value;
   let searchURL = `${dbURL}searcher?name=${name}&owner=${owner}&power=${power}`;
  console.log(searchURL);
  fetch(searchURL)
  .then(data => data.json())
  .then(json => func_load_searching_result(json['data']))
}

function func_load_searching_result(data){
  //Reload list in aside, delete all points on map, add points only searched
  console.log(console.table(data));
  func_removeDivsById('aside-object-list', allObj);
  const dataLength = data.length;
  func_insertDivsToAside(dataLength, data);
}

function func_removeDivsById(id, count) {
  var elements = document.querySelectorAll('div#' + id);
  for (var i = 0; i < count && i < elements.length; i++) {
    elements[i].parentNode.removeChild(elements[i]);
  }
}

function func_insertDivsToAside(count, data) {
  var aside = document.querySelector('aside');
  for (var i = 0; i < count; i++) {
    var div = document.createElement('div');
    div.setAttribute('id', 'aside-object-list');
    console.log(data[i]['lat']);
    div.innerHTML = `<p>Nazwa:${data[i]['name']}</br></p>
                     <p>Typ: ${data[i]['type']}</br></p>
                     <p>Moc: ${data[i]['power']}</br></p>
                     <p>Właściciel: ${data[i]['owner']}</br></p>`;
    aside.appendChild(div);
  }
}

//Clear all input fields, reload all powerplants
document.getElementById('button_clr').onclick = function() {
  let nameField = document.getElementById('srch_powerplant_name');
  let ownerField = document.getElementById('srch_powerplant_owner');
  let powerField = document.getElementById('srch_powerplant_power');
  nameField.value = "";
  ownerField.value = "";
  powerField.value = "";
  func_removeDivsById('aside-object-list', document.getElementById('aside-object-list').length);
  func_load_map_data();
};

