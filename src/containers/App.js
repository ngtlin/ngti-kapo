import React, { Component } from 'react';
import { StaticMap } from 'react-map-gl';
import DeckGL from 'deck.gl';
import {
  LayerControls,
  MapStylePicker,
  HEXAGON_CONTROLS
} from '../components/controls';
import { tooltipStyle } from '../components/style';
import taxiData from '../data/taxi';
import heatmapData from '../data/heatmap';
import zurichData from '../data/zurich-heatmap';
import { renderLayers } from '../components/deckgl-layers';

import KmlReader from '../utils/KmlReader';

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
  zoom: 11,
  minZoom: 5,
  maxZoom: 16,
  pitch: 30,
  bearing: 0
};

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
    /*
    const points = taxiData.reduce((accu, curr) => {
      accu.push({
        position: [Number(curr.pickup_longitude), Number(curr.pickup_latitude)],
        pickup: true
      });

      accu.push({
        position: [
          Number(curr.dropoff_longitude),
          Number(curr.dropoff_latitude)
        ],
        pickup: false
      });
      return accu;
    }, []);
    */
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

  onStyleChange = style => {
    this.setState({ style });
  };
  _onWebGLInitialize = gl => {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  };
  _updateLayerSettings(settings) {
    this.setState({ settings });
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings } = this.state;
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
        <LayerControls
          settings={settings}
          propTypes={HEXAGON_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}
        />
        <DeckGL
          onWebGLInitialized={this._onWebGLInitialize}
          layers={renderLayers({
            data: this.state.points,
            onHover: hover => this._onHover(hover),
            settings
          })}
          initialViewState={INITIAL_VIEW_STATE}
          controller
          debug
        >
          <StaticMap
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle={this.state.style}
          />
        </DeckGL>
      </div>
    );
  }
}

export default App;
