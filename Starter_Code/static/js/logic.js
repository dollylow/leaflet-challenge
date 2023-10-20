// Store queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
    createFeatures(data.features);
});

// Function to design marker size by magnitude
function markerSize(magnitude) {
    return magnitude * 15000;
    };

  // Function to design marker color by depth
    function markerColor(depth) {
        if (depth < 10) return "#FB8CAB";
        else if (depth < 30) return "#E65C9C";
        else if (depth < 50) return "#CF268A";
        else if (depth < 70) return "#AF1281";
        else if (depth < 90) return "#6B0772";
        else return "#360167";
    }

function createFeatures(earthquakeData) {

// Create a GeoJSON layer that contains the features array on the earthquakeData object.
// Perform onEachFeature function once for each piece of data in the array.
let earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: function(feature, layer) {
        layer.bindPopup(
            "<h3>Location: " + feature.properties.place + "</h3>" +
            "<h3>Date: " + new Date(feature.properties.time).toLocaleString() + "</h3>" +
            "<h3>Magnitude: " + feature.properties.mag + "</h3>" +
            "<h3>Depth: " + feature.geometry.coordinates[2] + "</h3>",
        );
    },

      // Point to the layer used to alter markers
        pointToLayer: function(feature, latlng) {
        
        // Apply marker size and color functions and define other features of the markers
        let markers = {
            radius: markerSize(feature.properties.mag),
            fillColor: markerColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.7,
            color: 'blue',
            weight: 0.5
        }
        return L.circle(latlng, markers);
    }
});

// Send our earthquakes layer to the createMap function/
createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

  // Create a baseMaps object.
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

  // Create an overlay object to hold our overlay.
    let overlayMaps = {
        Earthquakes: earthquakes
    };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
        center: [
        37.09, -95.71
        ],
        zoom: 5,
        layers: [street, earthquakes]
    });

  // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


// Create the legend
let legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "legend");
    let legendInfo =
        "<div><table><tr><th>Earthquake Depth</th></tr>" +
        "<tr style='background-color: #44ce1b; font-weight: bold; text-align: center'><td>-10-10</td></tr>" +
        "<tr style='background-color: #bbdb44; font-weight: bold; text-align: center'><td>10-30</td></tr>" +
        "<tr style='background-color: #f7e379; font-weight: bold; text-align: center'><td>30-50</td></tr>" +
        "<tr style='background-color: #f2a134; font-weight: bold; text-align: center'><td>50-70</td></tr>" +
        "<tr style='background-color: #e51f1f; font-weight: bold; text-align: center'><td>70-90</td></tr>" +
        "<tr style='background-color: #660000; font-weight: bold; text-align: center'><td>90+</td></tr></table></div>";

    div.innerHTML = legendInfo;
    return div;
};

legend.addTo(myMap);
}
