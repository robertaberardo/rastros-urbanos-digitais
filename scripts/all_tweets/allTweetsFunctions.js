// type: 'vector',
// url: 'mapbox://robertaberardo.unique-places-by-date'
// });
// map.addLayer({
// 'source-layer': 'unique-places-by-date-circle',

// Acho que nao ta tão diferente os dois para carregar, mas ta auqi o registro

function animateTweetsByDate() {

  // mostrar adicionando por meses pode ser uma boa solução, desde que o tempo não seja tão diferente

  // se separar em 12 funções mesmo, acho que funcion
  
  map.addSource('all-tweets-circle-source', {
    type: 'geojson',
    data: uniquePlacesByDateData
  });
  // Add a layer to the map
  map.addLayer({
    id: 'all-tweets-circle',
    type: 'circle',
    source: 'all-tweets-circle-source',
    paint: {
      'circle-radius': 2,
      'circle-color': '#71391C',
      'circle-opacity': 0.3
    },
    filter: false
  });

  // Animate the data
  var startDate = new Date('2022-01-02'); // Replace with the start date of your data
  var currentDate = startDate;
  var endDate = new Date('2022-01-31'); // Replace with the end date of your data

  var started = false

  // leftText.style.opacity = 1;
  // leftText.style.opacity = 0.5;
  leftText.innerText = 'Esse metadado geográfico pode ser extraído permitindo que ele seja reprojetado no território.'
  rightText.innerText = 'Tweets de Janeiro de 2022'
  // todo: remover dados da camada anterior

  started = true


  setTimeout(() => {
    // console.log('Começou')

    var animation = setInterval(function () {
      if (currentDate <= endDate) {
        currentDateString = currentDate.toISOString().split('T')[0]
        // console.log(currentDateString)

        // map.removeLayer('title-layer')

        map.setFilter('all-tweets-circle', ['<=', 'date_str', currentDateString]);

        // // Update the title with the current date
        // title.innerText = currentDate.toISOString().split('T')[0];

        currentDate.setDate(currentDate.getDate() + 1); // Increment the date

      } else {
        clearInterval(animation);
      }
    }, 10); // Adjust the interval (milliseconds) to control the animation speed
  }, 1500)


  // Update the title after the layer is rendered on the map
  // map.on('render', function () {
  //   var currentFilter = map.getFilter('all-tweets-circle');
  //   if (currentFilter) {
  //     var currentDate = currentFilter[2].split('T')[0];
  //     title.innerText = currentDate;
  //   }
  // });

  // TODO: RESOLVER COMO RETONAR ANIMATION
  return null

}

// TODO posso colocar numa variável, ao invés de calcular
function getLastDaysOfYear(year) {
  const lastDays = [];
  
  for (let month = 0; month < 12; month++) {
      const date = new Date(year, month + 1, 0);
      lastDays.push(date);
  }
  
  return lastDays;
  }

const year = 2022;
const lastDaysOfMonths = getLastDaysOfYear(year);

let index = 1; // ignora janeiro


function animateTweetsByMonth() {
if (index < lastDaysOfMonths.length) {
  const lastDay = lastDaysOfMonths[index];
  var currentDate = lastDay;

  // SEPA FADE IN! 
  currentDateString = currentDate.toISOString().split('T')[0]
  map.setFilter('all-tweets-circle', ['<=', 'date_str', currentDateString]);

  index++;
  setTimeout(animateTweetsByMonth, 50);
}
}


// function addAllTweetsData() {
//   var color = d3.scaleLinear()
//     .domain([0, 2000, 4000])
//     .range([0, 0.9, 1]);

//   // TODO Funcionando mas muito pouco pouco contraste, teria que testar mais
//   let decAllTweetskOverlay = new deck.MapboxOverlay({

//     layers: [
//       new deck.CPUGridLayer({
//         data: uniquePlacesCountData.features,
//         cellSize: 200,
//         extruded: false,
//         getPosition: d => d.geometry.coordinates,
//         pickable: true,
//         getColorWeight: d => color(d.properties.count),
//         opacity:0.2,
//         colorRange: [[247,244,249], [231,225,239], [212,185,218], 
//         [201,148,199], [223,101,176], [231,41,138],
//         [206,18,86], [152,0,67], [103,0,31]]
//       })
//     ]
//   });


//   map.addControl(decAllTweetskOverlay);
// }

var allTweetsRangeInterpolation = d3.scaleLinear()
.domain([0, 3201])
.range([0, 1]);

function addAllTweetsData() {

  // TODO: Esse não é o dado certo, só considera dados únicos por dia
  map.addSource('unique-places-count', {
    type: 'geojson',
    data: uniquePlacesCountData
  })

  // TESTES DEFINIDOS POR ESCALA MEIO LOG, DEFINIDO E COM PARADAS CERTINHAS

  var colorInterpolationFunction = d3.interpolateBlues

  map.addLayer(
    {
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'unique-places-count',
      paint: {
        "heatmap-opacity": 0,
        "heatmap-opacity-transition": {duration: 4000},
        'heatmap-weight': // acho que tem que mudar pq tem a soma né 
        [
          'interpolate',
          ['linear'],
          ['get', 'count'],
          0,
          0,
          3201,
          1
          ],
        'heatmap-intensity': 2,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          allTweetsRangeInterpolation(0),
          'rgba(0,0,0,0)',
          // allTweetsRangeInterpolation(0.9999),
          // 'rgba(0,0,0,0)',
          allTweetsRangeInterpolation(1),
          colorInterpolationFunction(0.1),
          allTweetsRangeInterpolation(10),
          colorInterpolationFunction(0.1),
          allTweetsRangeInterpolation(11),
          colorInterpolationFunction(0.3),
          allTweetsRangeInterpolation(50),
          colorInterpolationFunction(0.3),
          allTweetsRangeInterpolation(51),
          colorInterpolationFunction(0.4),
          allTweetsRangeInterpolation(100),
          colorInterpolationFunction(0.4),
          allTweetsRangeInterpolation(101),
          colorInterpolationFunction(0.5),
          allTweetsRangeInterpolation(200),
          colorInterpolationFunction(0.5),
          allTweetsRangeInterpolation(201),
          colorInterpolationFunction(0.6),
          allTweetsRangeInterpolation(400),
          colorInterpolationFunction(0.6),
          allTweetsRangeInterpolation(401),
          colorInterpolationFunction(0.7),
          allTweetsRangeInterpolation(800),
          colorInterpolationFunction(0.7),
          allTweetsRangeInterpolation(801),
          colorInterpolationFunction(0.8),
          allTweetsRangeInterpolation(1600),
          colorInterpolationFunction(0.8),
          allTweetsRangeInterpolation(1601),
          colorInterpolationFunction(0.9),
          allTweetsRangeInterpolation(3200),
          colorInterpolationFunction(0.9),
          allTweetsRangeInterpolation(3201),
          colorInterpolationFunction(1)
        ],
        'heatmap-radius': {
          stops: [
            [11, 15],
            [15, 100]
          ]
        },
        // decrease opacity to transition into the circle layer
        // 'heatmap-opacity': {
        //   default: 1,
        //   stops: [
        //     [14, 1],
        //     [15, 0]
        //   ]
        // },
        // 'heatmap-opacity': 0.75
      }
    }, ...getSymbolLayers())

    map.setPaintProperty('heatmap-layer', 'heatmap-opacity', 0.75)

}


function addAllTweetsLegend() {

  var colorInterpolationFunction = d3.interpolateBlues

  var stops = {
    "1 - 10 ": colorInterpolationFunction(0.1),
    "10 - 50": colorInterpolationFunction(0.3),
    "50 - 100": colorInterpolationFunction(0.4),
    "100 - 200": colorInterpolationFunction(0.5),
    "200 - 400": colorInterpolationFunction(0.6),
    "400 - 800": colorInterpolationFunction(0.7),
    "800 - 1600": colorInterpolationFunction(0.8),
    "1600 - 3200": colorInterpolationFunction(0.9),
    "> 3200": colorInterpolationFunction(1),
  };

  addLegend(stops);

}

