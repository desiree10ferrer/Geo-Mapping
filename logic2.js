// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

function markerSize(magnitude) {
  return magnitude * 5;
};


var earthquakes = new L.LayerGroup();

d3.json(queryUrl, function (data) {
    L.geoJSON(data.features, {
        pointToLayer: function (getmag, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(getmag.properties.mag) });
        },

        style: function (feature) {
            return {
                fillColor: Color(feature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'

            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h3>" + new Date(feature.properties.time) +
                "</h3> <hr> <h4>" + feature.properties.title + 
                "</h4> <hr> <h4>" + "Magnitude:" + feature.properties.mag + "</h4>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});


function Color(magnitude) {
  if (magnitude > 5) {
      return '#b30000'
  } else if (magnitude > 4) {
      return '#e34a33'
  } else if (magnitude > 3) {
      return '#fc8d59'
  } else if (magnitude > 2) {
      return '#fdbb84'
  } else if (magnitude > 1) {
      return '#fdd49e'
  } else {
      return '#fef0d9'
  }
};

function createMap() {

  // Define lightmap and darkmap layers
  var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openlightmap.org/\">Openlightmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openlightmap.org/\">Openlightmap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Light Map": lightmap,
    "Dark Map": darkmap
  };


  // Create our map, giving it the lightmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      34.325417181527584,-100.79244631426445
    ],
    zoom: 4,
    layers: [lightmap, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps).addTo(myMap);

// Create Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0, 1, 2, 3, 4, 5],
        labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + Color(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
}