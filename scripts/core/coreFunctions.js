function fadeOutLayer(layerId, duration) {

  const layer = map.getLayer(layerId);
  if (!layer) return;
  var opacityProperty = layer.type.concat('-opacity')

  let opacity = map.getPaintProperty(layerId, opacityProperty);
  const interval = 50; // Interval in milliseconds
  const steps = duration / interval;
  const opacityStep = 1 / steps;

  const fadeOutInterval = setInterval(() => {
    opacity -= opacityStep;
    if (opacity <= 0) {
      // Remove the layer when opacity reaches 0
      map.removeLayer(layerId);
      clearInterval(fadeOutInterval);
    } else {
      // Update the layer's opacity
      map.setPaintProperty(layerId, opacityProperty, opacity);
    }
  }, interval);
}

function enableForwardButton() {
  forwardButton.disabled = false;
  forwardButton.style.opacity = 1;
}

function disableForwardButton() {
  forwardButton.disabled = true;
  forwardButton.style.opacity = 0.3;
}


function enableMapInteraction() {
  window.NavigationControl = new mapboxgl.NavigationControl();
  map.addControl(NavigationControl, 'top-right');
  mapContainer.style['pointer-events'] = 'auto';
}

function disableMapInteraction() {
  map.removeControl(NavigationControl);
  mapContainer.style['pointer-events'] = 'none';
}

let timer;

// Step 3: Add event listeners to detect data events
function enableForwardButtonOnDataIdle() {

  const initializeTimer = () => {
    // Reset the timer whenever a data event occurs
    clearTimeout(timer);
    // Set a new timer to enable the forward button after 2 seconds
    timer = setTimeout(() => {
      // Step 4: Enable the forward button and turn off the event watcher
      enableForwardButton();
      map.off('data', initializeTimer);
    }, 2000);
  };

  map.on('data', initializeTimer);
}

function addLegend(layerId) {
  // create legend
  const style = map.getStyle();
  const layer = style.layers.find((i) => i.id === layerId);
  // const layer = map.getLayer(layerId);
  var colorProperty = layer.type.concat('-color')
  const fill = layer.paint[colorProperty];
  // Remove the interpolate expression to get the stops
  const stops = fill.slice(3);
  // stops = [
  //   '0-10',
  //   '10-20',
  //   '20-50',
  //   '50-100',
  //   '100-200',
  //   '200-500',
  //   '500-1000',
  //   '1000+'
  // ];
  // const colors = [
  //   '#FFEDA0',
  //   '#FED976',
  //   '#FEB24C',
  //   '#FD8D3C',
  //   '#FC4E2A',
  //   '#E31A1C',
  //   '#BD0026',
  //   '#800026'
  // ]


  stops.forEach((stop, index) => {
    if (index % 2 === 0) {

      // const color = colors[i];
      const item = document.createElement('div');
      const key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = stops[index + 1];

      const value = document.createElement('span');
      value.innerHTML = `${stop}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
    }
  });
}

function calculateCount(heatmapWeight) {
  const inputRange = [0, 0.9, 1];
  const outputRange = [0, 2000, 4000];

  if (heatmapWeight <= inputRange[0]) {
    return outputRange[0];
  } else if (heatmapWeight >= inputRange[inputRange.length - 1]) {
    return outputRange[outputRange.length - 1];
  } else {
    // Perform linear interpolation
    for (let i = 1; i < inputRange.length; i++) {
      if (heatmapWeight <= inputRange[i]) {
        const weightDiff = inputRange[i] - inputRange[i - 1];
        const countDiff = outputRange[i] - outputRange[i - 1];
        const weightRatio = (heatmapWeight - inputRange[i - 1]) / weightDiff;
        return outputRange[i - 1] + weightRatio * countDiff;
      }
    }
  }
}



function addLegendLinearInterpolation(layerId) {
  // create legend
  const style = map.getStyle();
  const layer = style.layers.find((i) => i.id === layerId);
  // const layer = map.getLayer(layerId);
  var colorProperty = layer.type.concat('-color');
  var weightProperty = layer.type.concat('-weight');

  const fill = layer.paint[colorProperty];
  // Remove the interpolate expression to get the stops
  const stops = fill.slice(3);
  var weightStops = layer.paint[weightProperty].slice(3);


  stops.forEach((stop, index) => {
    if (index % 2 === 0) {

      // const color = colors[i];
      const item = document.createElement('div');
      const key = document.createElement('span');
      key.className = 'legend-key';
      key.style.backgroundColor = stops[index + 1];

      const value = document.createElement('span');
      value.innerHTML = `${allTweetsRangeInterpolation.invert(stop).toFixed(1)}`;
      item.appendChild(key);
      item.appendChild(value);
      legend.appendChild(item);
      legend.style.opacity = 1;
    }
  });
}


function getSymbolLayers() {
  var layers2 = map.getStyle().layers;
  // Find the index of the first symbol layer in the map style.

  var symbolLayersIds2 = []
  for (var layer of layers2) {
    if (layer.type === 'symbol') {
      symbolLayersIds2.push(layer.id);
    }
  }
  return symbolLayersIds2
}



function addLegend(stops) {
  legend.innerHTML = null;

  Object.keys(stops).forEach((k, i) => {


    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = stops[k];

    const value = document.createElement('span');
    // value.innerHTML = `${allTweetsRangeInterpolation.invert(k).toFixed(1)}`;
    value.innerHTML = `${k}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
    legend.style.opacity = 1;

  });

}


function addGradientLegend(stops) {
  legend.innerHTML = null;

  legend.style.display = 'flex';

  const gradientContainer = document.createElement('div');
  const valueContainer = document.createElement('div');

  var gradient = 'linear-gradient(to bottom, ';
  var stopCount = Object.keys(stops).length;

  Object.keys(stops).forEach((k, i) => {


    const item = document.createElement('div');
    const value = document.createElement('span');
    value.innerHTML = `${k}`;
    item.appendChild(value);
    valueContainer.appendChild(item);

    // gradient
    var color = stops[k];
    gradient += `${color} ${Math.floor((i / (stopCount - 1)) * 100)}%, `;

    if (i === stopCount - 1) {
      gradient += `${color} 100%)`;
    }

    i++;

  });

  gradientContainer.style.backgroundImage = gradient;
  gradientContainer.style.width = '15px';
  gradientContainer.style.marginRight = '10px';
  legend.appendChild(gradientContainer);


  legend.appendChild(valueContainer);
  legend.style.opacity = 1;

}
