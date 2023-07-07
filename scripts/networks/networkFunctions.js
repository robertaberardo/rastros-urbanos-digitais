let networkColorsInterpolate = d3.interpolateRgb("#FFC6C4", "#672044");
let networkLG20000Color = '#4E1833';

// var networkDistanceFilteredData = deckGLNetworkDistanceCountData.filter(function (item) {
// 	return (
// 		item.count >= 50
// 	);
// });

// function getNetworkColor(n) {
// 	if (n > 20000) {
// 		return networkLG20000Color
// 	} else {
// 		return networkColorsInterpolate(n / 20000)
// 	}

// }

let networkChangeColorStop = 6000


var interpolateNetworkColor = d3
  .scaleLinear()
  .domain([420,networkChangeColorStop, 15000, 20001, 40000])
  .range([
	'#FFEFCF',
  	'#FFC6C4',
    '#672044',
	networkLG20000Color,
    networkLG20000Color 
  ]);


function getDestinationFeatures(destinationSourceId, filter = null) {
	const circleSource = map.getSource(destinationSourceId);

	if (!circleSource) {
		console.error('Circle source not found.');
		return;
	}

	// const circleLayer = map.getLayer(destinationSourceId);

	// if (!circleLayer) {
	//   console.error('Circle layer not found.');
	//   return;
	// }

	const sourceLayer = circleSource.vectorLayerIds[0];

	const queryOptions = {
		sourceLayer: sourceLayer
	};

	if (filter) {
		queryOptions.filter = filter;
	}

	const circleFeatures = map.querySourceFeatures(destinationSourceId,
		queryOptions
	);

	return circleFeatures;
}

function getDestinationFeatures2(destinationSourceId, destinationSourceLayerId, filter = null) {
	const circleSource = map.getSource(destinationSourceId);
	console.log(circleSource);

	const queryOptions = {
		sourceLayer: destinationSourceLayerId
	};

	if (filter) {
		queryOptions.filter = filter;
	}

	const circleFeatures = map.querySourceFeatures(destinationSourceId,
		queryOptions
	);

	return circleFeatures;
}


function addNetworkLines(layerName, point, destinationFeatures, aboveLayerIds = []) {

	let lineDistances = [];

	const lineFeatures = destinationFeatures.map((feature) => {
		const circleCenter = feature.geometry.coordinates;

		// Calculate the line coordinates between the given point and the circle center
		const lineCoordinates = [
			point, // Given point
			circleCenter // Circle center
		];

		// Create a line feature with the calculated coordinates

		lineFeature = {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: lineCoordinates
			},
			properties: {} // Additional properties for the line feature
		};

		let distance_ = turf.length(lineFeature, { units: 'meters' })

		lineDistances.push(distance_)
		lineFeature.properties = { distance: distance_ }

		return lineFeature
	});

	// Create a GeoJSON feature collection with the line features
	const lineFeatureCollection = {
		type: 'FeatureCollection',
		features: lineFeatures
	};

	// Returns a random number:
	randomString = Math.random().toString()
	sourceName = 'network-lines-' + randomString;
	// layerName = 'network-lines-layer-' + randomString;

	map.addSource(sourceName, {
		type: 'geojson',
		data: lineFeatureCollection
	})

	// Create a new line layer using the GeoJSON feature collection
	const lineLayer = {
		id: layerName,
		type: 'line',
		source: sourceName,
		// Additional styling and properties for the line layer
		paint: {
			'line-color': brownColor,

			'line-width': 2,
			'line-opacity': 0.2,
			// 'line-dasharray': [2, 5]
		}
	};



	// Add the line layer to the map
	// TODO AJUSTAR ISSO
	map.addLayer(lineLayer, ...aboveLayerIds)

	return lineDistances

}

function addNetworkLinesInteractive(point, destinationFeatures, aboveLayerIds = []) {

	const lineFeatures = destinationFeatures.map((feature) => {
		const circleCenter = feature;

		// Calculate the line coordinates between the given point and the circle center
		const lineCoordinates = [
			point, // Given point
			circleCenter // Circle center
		];

		// Create a line feature with the calculated coordinates

		lineFeature = {
			type: 'Feature',
			geometry: {
				type: 'LineString',
				coordinates: lineCoordinates
			}
		};

		lineFeature['properties'] = {}
		lineFeature.properties['distance'] = turf.length(lineFeature, { units: 'meters' })

		return lineFeature
	});

	// const pointFeatures = destinationFeatures.map((feature) => {
	// 	pointFeature = {
	// 		type: 'Feature',
	// 		geometry: {
	// 			type: 'Point',
	// 			coordinates: feature
	// 		}
	// 	};

	// 	return pointFeature
	// });

	// Create a GeoJSON feature collection with the line features
	const lineFeatureCollection = {
		type: 'FeatureCollection',
		features: lineFeatures
	};

	// const pointFeatureCollection = {
	// 	type: 'FeatureCollection',
	// 	features: pointFeatures
	// }

	// Returns a random number:
	randomString = Math.random().toString()
	lineSourceName = 'network-lines-' + randomString;
	// pointSourceName = 'network-points-' + randomString;


	map.addSource(lineSourceName, {
		type: 'geojson',
		data: lineFeatureCollection
	})

	// map.addSource(pointSourceName, {
	// 	type: 'geojson',
	// 	data: pointFeatureCollection
	// })

	if (map.getLayer('network-lines-interactive-layer')) {map.removeLayer('network-lines-interactive-layer')}
	if (map.getLayer('network-points-interactive-layer')) {map.removeLayer('network-points-interactive-layer')}

	// Create a new line layer using the GeoJSON feature collection
	const lineLayer = {
		id: 'network-lines-interactive-layer',
		type: 'line',
		source: lineSourceName,
		paint: {
			// 'line-color': brownColor,
			'line-color': [
				'interpolate',
				['linear'],
				['get', 'distance'],
				420,
				interpolateNetworkColor(420),
				networkChangeColorStop,
				interpolateNetworkColor(networkChangeColorStop),
				20000,
				interpolateNetworkColor(20000),
				20001,
				interpolateNetworkColor(20001)
				// networkLG20000Color
				
			],
			'line-width': 2,
			'line-opacity': 0.4, //0.2
		}
	};

	// const pointLayer = {
	// 	id: 'network-points-interactive-layer',
	// 	type: 'circle',
	// 	source: pointSourceName,
	// 	paint: {
	// 		'circle-color': brownColor,
	// 		'circle-radius': 1.5,
	// 		'circle-opacity': 0.3
	// 	}
	// }

	map.addLayer(lineLayer, ...aboveLayerIds)
	// map.addLayer(pointLayer, ...aboveLayerIds)

}

function changeNetworkLinesColors(layerId) {
	// map.setPaintProperty(layerId,
	// 	'line-color',
	// 	[
	// 		'interpolate',
	// 		['linear'],
	// 		['get', 'distance'],
	// 		0,
	// 		'#fff7f3',
	// 		1000,
	// 		'#fde0dd',
	// 		2000,
	// 		'#fcc5c0',
	// 		4000,
	// 		'#fa9fb5',
	// 		6000,
	// 		'#f768a1',
	// 		8000,
	// 		'#dd3497',
	// 		10000,
	// 		'#ae017e',
	// 		15000,
	// 		'#7a0177',
	// 		20000,
	// 		'#49006a'

	// 	]
	// )

	map.setPaintProperty(layerId,
		'line-color',
		[
			'interpolate',
			['linear'],
			['get', 'distance'],
			420,
			interpolateNetworkColor(420),
			networkChangeColorStop,
			interpolateNetworkColor(networkChangeColorStop),
			20000,
			interpolateNetworkColor(20000),
			20001,
			interpolateNetworkColor(20001)
			// networkLG20000Color
			
		]
	)

	map.setPaintProperty(layerId,
		'line-opacity',
		1);
}



function addNetworkChart() {
	sortedDistances = networkBrahmaLineDistances.filter(function (value) {
		return value !== null && value !== undefined;
	}).sort(function (a, b) {
		return a - b;
	});
	// Create a trace for the bar chart

	sortedDistances = sortedDistances.reverse();

	sortedDistances.forEach((distance) => {
		// if (distance > 20000) {
		// 	colors.push(networkLG20000Color)
		// } else {
		// 	colors.push(networkColorsInterpolate(distance / 20000))
		// }

		colors.push(interpolateNetworkColor(distance))
	});


	const trace = {
		// x: sortedDistances.map((_, index) => `Bar ${index + 1}`), // X-axis labels
		x: sortedDistances, // Y-axis values
		y: '',
		type: 'bar',// Specify chart type as bar,
		orientation: 'h',
		hovertemplate: '%{x}<extra></extra>',
		marker: {
			color: colors
			// width: 5
		},
	};

	// Define the layout for the chart
	const layout = {
		// title: 'Line Distances Bar Chart',
		plot_bgcolor: 'rgba(0, 0, 0, 0)', // Set the background color of the plot area
		paper_bgcolor: 'rgba(0, 0, 0, 0)', // Set the background color of the entire chart
		hovermode: "y",
		yaxis: {
			zeroline: false,
			showticklabels: false,
			fixedrange:true,
			hovermode: false,
			
		},
		font: {
			color: brownColor // Set the font color
		  },
		xaxis: {
			zeroline: false,
			title: {
				text: 'Distribuição dos comprimentos dos vincúlos',
				font: {
					family: 'Lora'
				}
			},
			fixedrange:true

		},
		hovermode: "closest",
		margin: {
			t: 30, // top margin
			l: 30, // left margin
			r: 0, // right margin
			b: 30 // bottom margin
		},
		// showlegend: false
		//width: 800 
	};

	// Combine the trace and layout into a data array
	const data = [trace];

	var config = {
		displayModeBar: false // Set displayModeBar to false to remove the menu
	};
	// Render the chart in the chartContainer div
	Plotly.newPlot('network-chart', data, layout, config);


	document.getElementById('network-chart').style.opacity = 1


}

function addNetworkLegend() {
  
	var stops = {
	  "400": interpolateNetworkColor(420),
	  "1000": interpolateNetworkColor(1000),
	  "2000": interpolateNetworkColor(2000),
	  "4000": interpolateNetworkColor(4000),
	  "6000": interpolateNetworkColor(6000),
	  "8000": interpolateNetworkColor(8000),
	  "10000": interpolateNetworkColor(10000),
	  "12000": interpolateNetworkColor(12000),
	  "14000": interpolateNetworkColor(14000),
	  "16000": interpolateNetworkColor(16000),
	  "18000": interpolateNetworkColor(18000),
	  "> 20000": interpolateNetworkColor(20000),
	};
  
	addGradientLegend(stops);
  
  }


function annotateNetworkChart() {
	// SEM SER INVERTIDO
	// var index75 = Math.ceil(sortedDistances.length * 0.75);

	// UMA VEZ INVERTIDAA LISTA
	var index75 = Math.ceil(sortedDistances.length * 0.25);


	var percentile75 = sortedDistances[index75 - 1];




	var updateLayout = {
		annotations: [
			{
				x: 17000,
				y: index75,
				xref: 'x',
				yref: 'y',
				text: 'abrangência da rede ' + percentile75.toFixed(1).toString() + '<br> ',
				font: {
					family: 'Lora',
					color: brownColor
				  },
				showarrow: false,
				// arrowhead: 7,
				// ax: -5,
				// ay: 0,
			},
		],
	};

	length_ = colors.length
	opacity_ = Array(length_).fill(0.1)
	opacity_[index75] = 1

	var updateStyle = {
		marker: {
			color: colors,
			width: 100,

			// opacity: 0.2,
			opacity: opacity_
		},
	};

	Plotly.update('network-chart', updateStyle, updateLayout)

}