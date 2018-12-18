import React, {Component} from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';
//import {MapboxLayer} from '@deck.gl/mapbox';
import omnivore from '@mapbox/leaflet-omnivore';
import {
  LayerControls,
  MapStylePicker,
  HEXAGON_CONTROLS
} from '../components/controls';
import { tooltipStyle } from '../components/style';
import zurichData from '../data/zurich-heatmap';
import { renderLayers } from '../components/deckgl-layers';

//import { connect } from 'react-redux';
//import './App.css';
console.log('-XXX->MapBox token=', process.env.MapboxAccessToken);
//const MAPBOX_TOKEN = process.env.MapboxAccessToken;
const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2o4OW90ZjNuMDV6eTMybzFzbmc3bWpvciJ9.zfRO_nfL1O3d2EuoNtE_NQ';

const INITIAL_VIEW_STATE = {
  //longitude: -74, //New York
  //latitude: 40.7,
  longitude: 8.542551, //zurich
  latitude: 47.369972,
  //longitude: -4.519993, //London
  //latitude: 55.483792,
  zoom: 15,
  minZoom: 5,
  maxZoom: 24,
  pitch: 45,
  bearing: 0
};

const navStyle = {
  position: 'absolute',
  bottom: 20,
  right: 10,
  padding: '10px'
};

const showLayerControls = false;

class App extends Component {

  constructor (props) {
    super(props);

    this.state = {
      hover: {
        x: 0,
        y: 0,
        hoveredObject: null
      },
      points: [],
      settings: Object.keys(HEXAGON_CONTROLS).reduce(
        (accu, key) => ({
          ...accu,
          [key]: HEXAGON_CONTROLS[key].value
        }),
        {}
      ),
      style: 'mapbox://styles/mapbox/light-v9'
    };
  }

  // componentWillMount() {
  //   KmlReader.parseKml("../data/zurich-doc.kml");
  // }

  componentDidMount() {
    this._processData();
  }

  _processData = () => {
   const points = /*heatmapData*/zurichData.reduce((accu, curr) => {
    accu.push({
      position: [Number(curr.longitude), Number(curr.latitude)],
      counts: curr.counts,
      //color: this._converColorHex(curr.color),
     });
    return accu;
  }, []);
    console.log('-XXX->_processData, points: ', points);
    this.setState({
      points
    });
  };

  _converColorHex = hex => {
    hex = hex.replace('#','');
    const r = parseInt(hex.substring(0,2), 16);
    const g = parseInt(hex.substring(2,4), 16);
    const b = parseInt(hex.substring(4,6), 16);
    const a = parseInt(hex.substring(6,8), 16);

    const result = [r,g,b,a];
    return result;
  }

  _onHover({ x, y, object }) {
    const label = object ? 
      object.points ?
        `${object.points.length} pickups or dropoffs here` :
        object.pickup ? 'Pickup' : 'Dropoff'
      : null;
      
    this.setState({ hover: { x, y, hoveredObject: object, label } });
  }

  _onViewportChange = viewport => {
    console.log('-XXX->_onViewportChange, viewport=', viewport);
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }

  onStyleChange = style => {
    this.setState({ style });
  };

  _onWebGLInitialized = gl => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    this.setState({gl});
  };

  _onMapLoad = () => {
    const map = this._map;
    const deck = this._deck;

    const MapboxTraffic = require('@mapbox/mapbox-gl-traffic');
    map.addControl(new MapboxTraffic());

    // fetch('../data/zurich-doc.kml')
    //   .then(response => response.text())
    //   .then(text => {
    //     console.log('-XXX->KMLtext, ', text);
    //     const kmlLayer = omnivore.kml.parse(text);
    //     console.log('-XXX->parsedKml, ', kmlLayer);
    //     kmlLayer.addTo(map);
    //   })
    //   .catch(error => {
    //     console.log(error);
    //   });
    // const klmLayer = omnivore.kml('https://res.cloudinary.com/ngti/raw/upload/v1545129598/klmdata/zurich-doc.kml').on('ready', function() {
    //   console.log('-XXX->KML loading ready! kmlLayer=', klmLayer);
    //   //map.fitBounds(klmLayer.getBounds());
    //   // After the 'ready' event fires, the GeoJSON contents are accessible
    //   // and you can iterate through layers to bind custom popups.
    //   klmLayer.eachLayer(function(layer) {
    //       // See the `.bindPopup` documentation for full details. This
    //       // dataset has a property called `name`: your dataset might not,
    //       // so inspect it and customize to taste.
    //       layer.bindPopup(layer.feature.properties.name);
    //   });      
    // }).addTo(map);

    //map.addLayer(new MapboxLayer({id: 'my-scatterplot', deck}), 'waterway-label');
    //Insert the layer beneath any symbol layer.
    const layers = map.getStyle().layers;

    let labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }
    map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 15,
      'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
      }
    }, labelLayerId);
  }

  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings, gl } = this.state;
    //console.log('-XXX>settings, ', settings);
    return (
      <div>
        {hover.hoveredObject && (
          <div
            style={{
              ...tooltipStyle,
              transform: `translate(${hover.x}px, ${hover.y}px)`
            }}
          >
            <div>{hover.label}</div>
          </div>
        )}
        <MapStylePicker
          onStyleChange={this.onStyleChange}
          currentStyle={this.state.style}
        />
        {showLayerControls &&
        <LayerControls
          settings={settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        }
        <DeckGL
          onWebGLInitialized={this._onWebGLInitialized}
          layers={renderLayers({
            data: this.state.points,
            onHover: hover => this._onHover(hover),
            settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          controller
          debug
        >
          {gl&&
            <StaticMap
              ref={ref => {
                // save a reference to the mapboxgl.Map instance
                this._map = ref && ref.getMap();
              }}
              mapboxApiAccessToken={MAPBOX_TOKEN}
              mapStyle={this.state.style}
              onLoad={this._onMapLoad}
            />
          }
        </DeckGL>
      </div>
    );
  }
}

export default App;
