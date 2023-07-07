let barBrahmaInitialText;

function displayPointsInPlace(geojsonPlace, zoom) {

  var all_tweets_data = uniquePlacesCountByDateData

  var filteredData = turf.pointsWithinPolygon(all_tweets_data, geojsonPlace);

  // Calculating the center
  var center = turf.center(geojsonPlace);

  // Extracting the coordinates
  var centerCoordinates = center.geometry.coordinates;
  console.log(centerCoordinates);

  // Assuming you have a Mapbox GL map instance created with the variable `map`
  map.flyTo({
    center: centerCoordinates,
    zoom: zoom, // optional zoom level
    duration: 5000,
    // speed: 1.5, // optional fly animation speed
    curve: 1, // optional fly animation curve
  });

  map.addSource('place-data', {
    type: 'geojson',
    data: geojsonPlace
  });

  map.addLayer({
    id: 'place-data-layer',
    type: 'line',
    source: 'place-data',
    paint: {
      'line-color': brownColor,
    }
  });


  map.addSource('filtered-data', {
    type: 'geojson',
    data: filteredData
  });

  map.addLayer({
    id: 'filtered-data-layer',
    type: 'circle',
    source: 'filtered-data',
    paint: {
      'circle-color': brownColor,
      'circle-radius': 3
    }
  });


  // var dates = filteredData.features.map(function(feature) {
  //     return feature.properties.date;
  //   });

  //   // console.log(counts);

  //   // Calculate the frequency of each date
  //   var dateFrequency = {};
  //   dates.forEach(function(date) {
  //     dateFrequency[date] = (dateFrequency[date] || 0) + 1;
  //   });


  var dateCounts = {};


  // todo: to achando pouco, será que está certo
  filteredData.features.forEach(function (feature) {
    var date = feature.properties.date;
    var count = feature.properties.count;

    if (dateCounts[date]) {
      dateCounts[date] += count;
    } else {
      dateCounts[date] = count;
    }
  });



  var data = [{
    x: Object.keys(dateCounts),
    y: Object.values(dateCounts),
    type: 'bar',
    marker: {
      color: brownColor // Set the bar color
    }

  }];

  var layout = {
    title: {
      text: 'Distribuição dos tweets por dia | Gráfico Interativo',
      font: {
        family: 'Lora',
        size: 14
      }
    },
    width: 400, // Set the width of the chart
    height: 200, // Set the height of the chart
    plot_bgcolor: 'rgba(0, 0, 0, 0)', // Set the background color of the plot area
    paper_bgcolor: 'rgba(0, 0, 0, 0)', // Set the background color of the entire chart
    xaxis: {
      fixedrange: true
    },
    yaxis: {
      fixedrange: true,
      dtick: 20,
      range: [0, 100]
    },
    font: {
      color: brownColor // Set the font color
    },
    hoverlabel: { bgcolor: brownColor },
    margin: {
      t: 30, // top margin
      l: 30, // left margin
      r: 0, // right margin
      b: 30 // bottom margin
    },
    bargap: 0.1 // Set the gap between the bars
  };

  var config = {
    displayModeBar: false // Set displayModeBar to false to remove the menu
  };


  Plotly.newPlot('chart', data, layout, config);


}