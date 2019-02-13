import {HexagonCellLayer} from 'deck.gl';

// const HEATMAP_COLORS = [
//   [255, 255, 204],
//   [199, 233, 180],
//   [127, 205, 187],
//   [65, 182, 196],
//   [44, 127, 184],
//   [37, 52, 148]
// ];

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

//const elevationRange = [0, 400];

const getColor = counts => {
  if (counts >= 1500) {
    return [37, 52, 148, 255];
  } else if (counts >= 1000) {
    return   [44, 127, 184, 255];
  } else if (counts >= 700) {
    return [65, 182, 196, 255];
  } else if (counts >= 400) {
    return [127, 205, 187, 255];
  } else if (counts >= 200) {
    return [199, 233, 180, 255];
  }
  return [255, 255, 204, 255];
};

export function renderLayers(props) {
  const { data, onHover, settings } = props;
  return [
    /*
    settings.showScatterplot &&
      new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => (d.pickup ? PICKUP_COLOR : DROPOFF_COLOR),
        getRadius: d => 5,
        opacity: 0.5,
        pickable: true,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        data,
        onHover,
        ...settings
      }),
    settings.showHexagon &&
      new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded: true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 0.8,
        pickable: true,
        data,
        onHover,
        ...settings
      })
      */
     settings.showHexagon &&
      new HexagonCellLayer({
        id: 'hexagon-cell-layer',
        data,
        getCentroid: d => d.position,
        getElevation: d => d.counts,
        getColor: d => getColor(d.counts),
        lightSettings: LIGHT_SETTINGS,
        //elevationRange,
        angle: 0,
        onHover,
        pickable: true,
        ...settings
      })
  ];
}
