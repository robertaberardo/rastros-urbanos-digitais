const layerRastroLinesIds = ['rastros_l_15410917', 'rastros_l_3724233975', 'rastros_l_1265649820225753000', 'rastros_l_299835847', 'rastros_l_52500909'];
const layerRastroPointsIds = ['rastros_p_15410917', 'rastros_p_3724233975', 'rastros_p_1265649820225753000', 'rastros_p_299835847', 'rastros_p_52500909'];
// algum bug com o nome rastros_p_1265649820225753000 3000 ao invés de 3089, mas ok

function addPathSources() {
    map.addSource('rastros_brahma_ord_geom_p', {
        type: 'vector',
        url: 'mapbox://robertaberardo.rastros_brahma_ord_geom_p_0517'
    });
    
    map.addSource('rastros_brahma_ord_geom_lines', {
        type: 'vector',
        url: 'mapbox://robertaberardo.rastros_brahma_ord_geom_l_0517'
    });
}


function addPathFromUser(userId, color, strokeColor) {
    let userIdString = userId.toString()
    let circle_layer_id = `rastros_p_${userIdString}`
    let line_layer_id = `rastros_l_${userIdString}`


    map.addLayer({
        id: circle_layer_id,
        type: 'circle',
        source: 'rastros_brahma_ord_geom_p',
        'source-layer': 'rastros_brahma_ord_geom_p_0517',
        paint: {
            'circle-color': color,
            'circle-stroke-color': strokeColor,
            'circle-stroke-width': 2,
            'circle-radius': 4,
            "circle-opacity": 0,
            "circle-opacity-transition": { duration: 1000 },
            'circle-stroke-opacity': 0,
            "circle-stroke-opacity-transition": { duration: 1000 },

        },
        filter: ["all",
            ['==', 'user_id', userId]
        ]
    })


    // map.addLayer({
    //     id: line_layer_id,
    //     type: 'line',
    //     source: 'rastros_brahma_ord_geom_lines',
    //     'source-layer': 'rastros_brahma_ord_geom_l_0517',
    //     'layout': {
    //         'line-cap': 'round',
    //     },
    //     paint: {
    //         'line-color': color,
    //         'line-width': [
    //             'interpolate',
    //             ['exponential', 2],
    //             ['zoom'],
    //             0, 0.75,  // At zoom level 0, set line width to 0.75
    //             15, 4     // At zoom level 18, set line width to 3
    //         ],
    //         'line-opacity': 0,
    //         "line-opacity-transition": { duration: 1000 },
    //         'line-dasharray': [2, 10]
    //     },
    //     filter: ['all', ["==", 'user_id', userId], ["!=", 'index', 199], ["!=", 'index', 182]]
    // })


    setTimeout(function () {
        map.setPaintProperty(circle_layer_id, 'circle-opacity', 1);
        map.setPaintProperty(circle_layer_id, 'circle-stroke-opacity', 1);

    }, 300);

    // setTimeout(function () {
    //     map.setPaintProperty(line_layer_id, 'line-opacity', 1);
    // }, 300);

}