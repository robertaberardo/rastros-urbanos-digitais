
function sumLongitudeWithDistance(longitude, distanceInMeters) {
  const earthCircumferenceInMeters = 40075000;
  const degreesPerMeter = 360 / earthCircumferenceInMeters;

  const distanceInDegrees = distanceInMeters * degreesPerMeter;
  const sum = longitude + distanceInDegrees;

  // Ensure the longitude stays within the range of -180 to 180
  const normalizedLongitude = (sum + 180) % 360 - 180;

  return normalizedLongitude;
}

function convertToGeoJSON(data) {
  // Create an empty array to store the features
  var features = [];

  // Iterate over the data array
  for (var i = 0; i < data.length; i++) {
    if (data[i].name != 'Sao Paulo ') {
      var location = data[i];

      // Create a GeoJSON feature for each location
      var feature = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [location.lon, location.lat]
        },
        properties: {
          name: location.name
        }
      };

      // Add the feature to the features array
      features.push(feature);
    }

  }

  var geojson = {
    type: 'FeatureCollection',
    features: features
  };

  return geojson;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


function networkFromDeckGL(choice, flyTo= true) {
  var regex = /\((-?\d+\.\d+), (-?\d+\.\d+)\)/;
  var matches = choice.match(regex);
  var center = [parseFloat(matches[2]), parseFloat(matches[1])];

  if (flyTo) {
      map.easeTo({
        essencial: true,
        center: center,
        duration: 2000,
        zoom: 11
    })
  }

  upperLeftText.style.backgroundColor = interpolateNetworkColor(5000).slice(4, -1).split(',').map(Number)

  deckOverlay.setProps({
      layers: [createNewColumnLayer(false, filteredData, choice)]
  });

  addNetworkLinesInteractive(center, allNetworksInteractive[choice])
}

let otherColumnsOpacity = 0;
let columnsRadius = 50;

function createNewColumnLayer(initial, data, clickedColumn) {
  return new deck.ColumnLayer({
    id: 'column-layer2',
    data:data,
    diskResolution: 40,
    radius: columnsRadius,
    extruded: true,
    pickable: true,
    autoHighlight: true,
    highlightColor: [173, 216, 230],
    // highlightColor: [255,255,255],
    material: false,
    getPosition: d => [d.lon, d.lat],
    getElevation: d => d.count_un_a * 25, //15

    getFillColor: d => {
      if (initial) {
        var opacity = 255
      } else {
        var  opacity = clickedColumn === `${d.name}(${d.lat}, ${d.lon})` ? 255 : otherColumnsOpacity; // Adjust the opacity values as needed
      }
      return interpolateNetworkColor(d.distance_75p).slice(4, -1).split(',').map(Number).concat(opacity);
    },

    updateTriggers: {
      getFillColor: [clickedColumn, otherColumnsOpacity],

    },
    
    onClick: ({ object, x, y }) => {      

      // obs o name está com um espaço a mais
      var choice = `${object.name}(${object.lat}, ${object.lon})`
      console.log(choice);
      networkFromDeckGL(choice=choice, flyTo=false);

    },
    onHover: ({ object, x, y }) => {      

      if (object) {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.top = `${y + 10}px`;
        tooltip.style.left = `${x + 10}px`;
        var text = object.name != 'Sao Paulo ' ?  `${object.name}<br>` : '' 
        text += `${object.count} tweets<br>${object.count_un_a} autores`
        tooltip.innerHTML = `<div>${text}</div>`;
        tooltip.style.display = 'block';
      } 
      else {
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'none';
      }
    }
  });

}


function addDeckGL(data, id) {
  var clickedColumn = null;

  deckOverlay = new deck.MapboxOverlay({
    layers: [createNewColumnLayer(true, data, clickedColumn)],
  });

  // map.addLayer({
  //   id: id,
  //   type: 'symbol',
  //   source: {
  //     type: 'geojson',
  //     data: convertToGeoJSON(data)
  //   },
  //   minzoom: 13,

  //   layout: {
  //     'text-field': ['get', 'name'],
  //     'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
  //     'text-radial-offset': 0.5,
  //     'text-justify': 'auto',
  //     'text-size': 12
  //   },
  //   paint: {
  //     'text-color': brownColor,
  //   }
  // });

    // TODO: adicionar os dados do mapbox depois dessa Layer
    map.addControl(deckOverlay);

    return deckOverlay
}


var deckOverlayTextAnnotation;

function addDeckGLAnnotation(data) {
  deckOverlayTextAnnotation = new deck.MapboxOverlay({
    layers: [
      new deck.TextLayer({
        id: 'text-layer',
        data,
        pickable: true,
        getPosition: d => [d.lon, d.lat, d.count_un_a * 30],
        getText: d => 'cor:\npercentil 75 \n rede',
        getSize: 10,
        getAngle: 0,
        fontFamily: 'Lora',
        getTextAnchor: 'middle',
        getColor: [113, 57, 28],
        getAlignmentBaseline: 'bottom'
      }),

      new deck.TextLayer({
        id: 'text-layer2',
        data,
        pickable: true,
        fontFamily: 'Lora',
        getPosition: d => [d.lon, d.lat, d.count_un_a * 10],
        getText: d => 'eixo Y:\nusu\u00e1rios\n\u00fanicos', // \u2191 \u2192
        getPixelOffset: d => [- d.distance_75p / 500 - 20, 0],
        getSize: 10,
        getAngle: 0,
        getColor: [113, 57, 28],
        getTextAnchor: 'middle',
        characterSet: ['\u00fa','\u00e1'],

        getAlignmentBaseline: 'center'
      })
    ]
  });

  map.addControl(deckOverlayTextAnnotation);
  
}


// FAZER NÃO TÁ FEITO 

// function updateDeckGl() {
//   deck.setProps({
//     layers:[
//       new deck.LineLayer({
//         id: 'LineLayer',
//         data: data,

//         /* props from LineLayer class */

//         // getColor: d => [Math.sqrt(d.inbound + d.outbound), 140, 0],
//         getColor: d => d3.interpolateRdPu(d.distance_75p / 20000).slice(4, -1).split(',').map(Number),
//         getSourcePosition: d => [d.lon, d.lat, 0],
//         // getTargetPosition: d => [d.lon, d.lat, d.distance_75p / 10],
//         // getWidth: d => d.count/20,
//         // getTargetPosition: d => [d.lon, d.lat, d.count],
//         getTargetPosition: d => [d.lon, d.lat, d.count_un_a * 10],

//         getWidth: d => d.distance_75p / 500,
//         // widthMaxPixels: Number.MAX_SAFE_INTEGER,
//         widthMinPixels: 1,
//         // widthScale: 1,
//         // widthUnits: 'pixels',

//         /* props inherited from Layer class */

//         autoHighlight: true,
//         // coordinateOrigin: [0, 0, 0],
//         // coordinateSystem: COORDINATE_SYSTEM.LNGLAT,
//         // highlightColor: [0, 0, 128, 128],
//         // modelMatrix: null,
//         // opacity: 0.75,
//         pickable: true,
//         billboard: true,
//         // visible: true,
//         // wrapLongitude: false,
//         onHover: ({ object, x, y }) => {
//           console.log(object)
//           // if (object) {
//           //   const tooltip = document.getElementById('tooltip');
//           //   tooltip.style.top = `${y}px`;
//           //   tooltip.style.left = `${x}px`;
//           //   tooltip.innerHTML = `<div>${object.name}</div>`;
//           //   tooltip.style.display = 'block';
//           // } else {
//           //   const tooltip = document.getElementById('tooltip');
//           //   tooltip.style.display = 'none';
//           // }
//         }
//       }),
//     ]
//   });
// }
