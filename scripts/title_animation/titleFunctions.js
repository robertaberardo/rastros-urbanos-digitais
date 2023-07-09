function initTitle() {
    map.addSource('title-data', {
        type: 'geojson',
        data: geojsonTitleData
    });

    // console.log(map.getStyle().layers)

    // temporário, até eu fazer de outra forma
    // map.setPaintProperty("estacoes-metro-1505 copy 3", 'circle-radius', 0)

    map.addLayer({
        id: 'title-layer',
        type: 'circle',
        source: 'title-data',
        paint: {
            'circle-radius': 2,
            'circle-color': '#71391C',
            'circle-opacity':0.3
        }
    });
}



// function animateTitle() {
//     // Animate movement of points to randomly chosen destinations
//     var destinationData = uniquePlaces20220101

//     //console.log(destinationData.features.length)

//     setTimeout(
//         geojsonTitleData.features.forEach(function (feature) {
//             // sao 745 dados nos títulos 
            
//             var start = turf.point(feature.geometry.coordinates);
//             var destinationIndex = Math.floor(Math.random() * destinationData.features.length);
//             var destinationPoint = turf.point(destinationData.features[destinationIndex].geometry.coordinates);

//             var bearing = turf.bearing(start, destinationPoint);
//             var distance = turf.distance(start, destinationPoint);

//             // var duration = 2000; // Duration of the animation in milliseconds
//             var duration = 100; // Só para acelerar testes
//             var steps = 30; // Number of steps for the animation

//             var stepDistance = distance / steps;
//             var currentStep = 0;

//             var timer = setInterval(function () {
//                 if (currentStep > steps) {
//                     clearInterval(timer);
//                 } else {
//                     var newCoordinates = turf.destination(start, stepDistance * currentStep, bearing).geometry.coordinates;
//                     feature.geometry.coordinates = newCoordinates;
//                     map.getSource('title-data').setData(geojsonTitleData);
//                     currentStep++;

//                     // Calculate the average position of the points
//                     var avgCoordinates = geojsonTitleData.features.reduce(function (acc, cur) {
//                         return [acc[0] + cur.geometry.coordinates[0], acc[1] + cur.geometry.coordinates[1]];
//                     }, [-80, -50]);
//                     avgCoordinates = [avgCoordinates[0] / geojsonTitleData.features.length, avgCoordinates[1] / geojsonTitleData.features.length];

//                     // Update the map's center coordinates to the average position
//                     map.setCenter(avgCoordinates);
//                     // console.log(avgCoordinates)

//                 }
//             }, duration / steps);
//         }), 1000)

// }


function animateTitle() {
    var destinationData = uniquePlaces20220101;

    setTimeout(function() {
        // var duration = 1000;
        // var steps = 30;
        // var offsetStep = [-80 / duration / 23, -50 / duration / 23]; 


        var duration = 500;
        var steps = 30;
        var offsetStep = [-80 / duration / 40, -50 / duration / 40]; // Step size for the offset
        var currentOffset = [0, 0]; // Current offset values

        geojsonTitleData.features.forEach(function(feature) {
            var start = turf.point(feature.geometry.coordinates);
            var destinationIndex = Math.floor(Math.random() * destinationData.features.length);
            var destinationPoint = turf.point(destinationData.features[destinationIndex].geometry.coordinates);
            var bearing = turf.bearing(start, destinationPoint);
            var distance = turf.distance(start, destinationPoint);

            var stepDistance = distance / steps;
            var currentStep = 0;

            var timer = setInterval(function() {
                if (currentStep > steps) {
                    clearInterval(timer);
                } else {
                    var newCoordinates = turf.destination(start, stepDistance * currentStep, bearing).geometry.coordinates;
                    feature.geometry.coordinates = newCoordinates;
                    map.getSource('title-data').setData(geojsonTitleData);
                    currentStep++;

                    // Calculate the average position with the current offset
                    var avgCoordinates = geojsonTitleData.features.reduce(function(acc, cur) {
                        return [acc[0] + cur.geometry.coordinates[0], acc[1] + cur.geometry.coordinates[1]];
                    }, currentOffset);
                    avgCoordinates = [avgCoordinates[0] / geojsonTitleData.features.length, avgCoordinates[1] / geojsonTitleData.features.length];

                    // Update the map's center coordinates to the average position
                    if (currentStep > 1) {
                    map.setCenter(avgCoordinates);}
                    // console.log(avgCoordinates)
                    // clearInterval(timer);


                    // Increment the offset for the next step
                    // console.log(offsetStep)
                    currentOffset[0] += offsetStep[0];
                    currentOffset[1] += offsetStep[1];
                    // console.log(currentOffset)

                }
            }, duration / steps);
        });
    }, 1000);
}


