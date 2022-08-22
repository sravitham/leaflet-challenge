// url for gejson data 
url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
// check that data is there
// d3.json(url).then(function (data){ 
//     console.log(data);
//     return data;
//   });

d3.json(url).then(data => {
    console.log(data);
    createFeatures(data);
});

function createFeatures(earthquakeData) {

    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3><b>Location:</b> ${feature.properties.place}</h3><hr><p><b>Date and Time:</b> ${new Date(feature.properties.time)}<hr><b>Magnitude:</b> ${feature.properties.mag}`);
    }

    function setStyle(feature) {
        return {
          opacity: 1,
          fillOpacity: 1,
          fillColor: getColor(feature.geometry.coordinates[2]),
          color: getColor(feature.geometry.coordinates[2]),
          radius: getRadius(feature.properties.mag),
          stroke: true,
          weight: 0.5
        };
      }
      function getColor(depth) {
        switch (true) {
          case depth > 90:
            return "#000033";
          case depth > 70:
            return "#000099";
          case depth > 50:
            return "#0000ff";
          case depth > 30:
            return "#4d4dff";
          case depth > 10:
            return "#8080ff";
          default:
            return "#ccccff";
        }
      }
        // Add Legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function(myMap) {
    var div = L.DomUtil.create('div', 'info legend'),
    depth = [-10, 10, 30, 50, 70, 90];
    div.innerHTML += "<h2 style='text-align: center'>Depth</h2>"
    for (var i =0; i < depth.length; i++) {
      div.innerHTML += 
      '<i style="background:' + chooseColor(depth[i] + 1) + '"></i> ' +
          depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

      return div;
  };

      function getRadius(magnitude) {
        if (magnitude === 0) {
          return 1;
        }
    
        return magnitude * 4;
      }
      var earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng){
          return L.circleMarker(latlng)
        },
        style: setStyle,
        onEachFeature: onEachFeature
      });
      console.log(earthquakes)
      // Send our earthquakes layer to the createMap function/
      createMap(earthquakes);
    }


function createMap(earthquakes) {

    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });
    var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
  };
    var overlayMaps = {
    Earthquakes: earthquakes
  };
    var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(myMap);
    
    
      legend.addTo(myMap);
};