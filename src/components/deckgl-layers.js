import {HexagonCellLayer, GeoJsonLayer} from 'deck.gl';
import {scaleThreshold} from 'd3-scale';

const RANGE_MAX = 2000;

const COLOR_SCALE = scaleThreshold()
  .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
  .range([
    [65, 182, 196],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    // zero
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ]);

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

//const elevationRange = [0, 2000];

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
      }),
      settings.showGeoJson &&
        new GeoJsonLayer({
          id: 'geojson',
          data,
          opacity: 0.7,
          stroked: true,
          filled: true,
          extruded: settings.show3D,
          wireframe: true,
          fp64: true,
          getElevation: f => Math.sqrt(f.properties.counts) * 10,
          getFillColor: f => COLOR_SCALE(f.properties.counts/RANGE_MAX),
          getLineColor: [255, 255, 255],
          lightSettings: LIGHT_SETTINGS,
          pickable: true,
          onHover
      })
  ];
}
