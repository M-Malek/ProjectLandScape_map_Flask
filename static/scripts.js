// Java Script file to load all data on a map
// Python Flask server provide site server and post method to download data from MongoDB database
// Two options: 1. local server (using: http://127.0.0.1:5000), 2. server hosted on web

// Load map:
// Set map main point (current: Poland)
var map = L.map('map').setView([52.0306978708904, 19.479774125612348], 6);

// Load map tile layer
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Load data from database
let url="http://127.0.0.1:5000/data";
fetch(url) // fetch data from flask api response
.then(result => result.json()) // set data as .json file
.then(data => func_load_points_on_map(data)) // run function to set all points on a map

//Function to load points on a map
function func_load_points_on_map(data){
  //console.log(Object.values(data));
  var dataArray = [];
  for (var object in data){
    dataArray.push(data[object]);
  }

  //console.log(dataArray["0"]);
  var dataArray = dataArray['0'];
  console.log(dataArray);
  /*for (let i = 1; i < (dataArray.length + 1); i++){
    var name = dataArray[0][i]['name'];
    var owner = dataArray[0][i]['owner'];
    var type = dataArray[0][i]['type'];
    var power = dataArray[0][i]['power'];
    var latitiude = parseInt(dataArray[0][i]['lat'], 10);
    var longitiude = parseInt(dataArray[0][i]['lng'], 10);
    const text = `
    ${name} </br> 
    Typ: ${type} </br>
    Moc: ${power} MW </br>
    Właściciel: ${owner}
    `;
    console.log(text);
    func_load_point(latitiude, longitiude, text);
  } */
  //console.log(Object.values(dataArray));
  /*Array.forEach(element =>
    console.log(`Test + ${element}`)
    ) */
}

function test(dane){
  console.log("Wait");
  console.log(dane);
}

// Load all points from database to a map:
// Step 1: function for automatically adding points to the map
function func_load_point(lng, lat, popupText){
    var marker = L.marker([lng, lat]).addTo(map);
    marker.bindPopup(popupText);
    console.log(`Setting point with description ${popupText}`);
}

// Step 2: for loop to parse all points on a map
func_load_points_on_map()

// Step 3: add all power plants to a list in aside tag



// Advanced searching for an object:
