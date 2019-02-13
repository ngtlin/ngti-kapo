import React, {Component} from 'react';
import {StaticMap} from 'react-map-gl';
import DeckGL from 'deck.gl';
import * as d3 from 'd3';
import * as ch from 'swiss-projection-light';
//import {MapboxLayer} from '@deck.gl/mapbox';
//import omnivore from '@mapbox/leaflet-omnivore';
import MapboxTraffic from '@mapbox/mapbox-gl-traffic';

import {
  LayerControls,
  MapStylePicker,
  HEXAGON_CONTROLS
} from '../components/controls';
import PlaybackControl from '../components/playbackControl';

import { tooltipStyle } from '../components/style';
//import zurichData from '../data/zurich-heatmap';
import { renderLayers } from '../components/deckgl-layers';

//import { connect } from 'react-redux';
//import './App.css';
console.log('-XXX->MapBox token=', process.env.MapboxAccessToken);
//const MAPBOX_TOKEN = process.env.MapboxAccessToken;
const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2o4OW90ZjNuMDV6eTMybzFzbmc3bWpvciJ9.zfRO_nfL1O3d2EuoNtE_NQ';

const INITIAL_VIEW_STATE = {
  // longitude: 8.542551, //zurich
  // latitude: 47.369972,
  longitude: 7.44744, // Bern
  latitude: 46.94809,
  zoom: 13,
  minZoom: 5,
  maxZoom: 24,
  pitch: 50,
  bearing: 0,
};

const showLayerControls = true;
const showPlaybackControl = true;
const autoStartPlayback = false;

const DATE = 'September 12, 2018';
const DATA_PATH = '../data/KAPOBern_20180912_15min/';
const DATA_FILES = [
  'heatmap_00:00:00.csv',
  'heatmap_00:15:00.csv',
  'heatmap_00:30:00.csv',
  'heatmap_00:45:00.csv',
  'heatmap_01:00:00.csv',
  'heatmap_01:15:00.csv',
  'heatmap_01:30:00.csv',
  'heatmap_01:45:00.csv',
  'heatmap_02:00:00.csv',
  'heatmap_02:15:00.csv',
  'heatmap_02:30:00.csv',
  'heatmap_02:45:00.csv',
  'heatmap_03:00:00.csv',
  'heatmap_03:15:00.csv',
  'heatmap_03:30:00.csv',
  'heatmap_03:45:00.csv',
  'heatmap_04:00:00.csv',
  'heatmap_04:15:00.csv',
  'heatmap_04:30:00.csv',
  'heatmap_04:45:00.csv',
  'heatmap_05:00:00.csv',
  'heatmap_05:15:00.csv',
  'heatmap_05:30:00.csv',
  'heatmap_05:45:00.csv',
  'heatmap_06:00:00.csv',
  'heatmap_06:15:00.csv',
  'heatmap_06:30:00.csv',
  'heatmap_06:45:00.csv',
  'heatmap_07:00:00.csv',
  'heatmap_07:15:00.csv',
  'heatmap_07:30:00.csv',
  'heatmap_07:45:00.csv',
  'heatmap_08:00:00.csv',
  'heatmap_08:15:00.csv',
  'heatmap_08:30:00.csv',
  'heatmap_08:45:00.csv',
  'heatmap_09:00:00.csv',
  'heatmap_09:15:00.csv',
  'heatmap_09:30:00.csv',
  'heatmap_09:45:00.csv',
  'heatmap_10:00:00.csv',
  'heatmap_10:15:00.csv',
  'heatmap_10:30:00.csv',
  'heatmap_10:45:00.csv',
  'heatmap_11:00:00.csv',
  'heatmap_11:15:00.csv',
  'heatmap_11:30:00.csv',
  'heatmap_11:45:00.csv',
  'heatmap_12:00:00.csv',
  'heatmap_12:15:00.csv',
  'heatmap_12:30:00.csv',
  'heatmap_12:45:00.csv',
  'heatmap_13:00:00.csv',
  'heatmap_13:15:00.csv',
  'heatmap_13:30:00.csv',
  'heatmap_13:45:00.csv',
  'heatmap_14:00:00.csv',
  'heatmap_14:15:00.csv',
  'heatmap_14:30:00.csv',
  'heatmap_14:45:00.csv',
  'heatmap_15:00:00.csv',
  'heatmap_15:15:00.csv',
  'heatmap_15:30:00.csv',
  'heatmap_15:45:00.csv',
  'heatmap_16:00:00.csv',
  'heatmap_16:15:00.csv',
  'heatmap_16:30:00.csv',
  'heatmap_16:45:00.csv',
  'heatmap_17:00:00.csv',
  'heatmap_17:15:00.csv',
  'heatmap_17:30:00.csv',
  'heatmap_17:45:00.csv',
  'heatmap_18:00:00.csv',
  'heatmap_18:15:00.csv',
  'heatmap_18:30:00.csv',
  'heatmap_18:45:00.csv',
  'heatmap_19:00:00.csv',
  'heatmap_19:15:00.csv',
  'heatmap_19:30:00.csv',
  'heatmap_19:45:00.csv',
  'heatmap_20:00:00.csv',
  'heatmap_20:15:00.csv',
  'heatmap_20:30:00.csv',
  'heatmap_20:45:00.csv',
  'heatmap_21:00:00.csv',
  'heatmap_21:15:00.csv',
  'heatmap_21:30:00.csv',
  'heatmap_21:45:00.csv',
  'heatmap_22:00:00.csv',
  'heatmap_22:15:00.csv',
  'heatmap_22:30:00.csv',
  'heatmap_22:45:00.csv',
  'heatmap_23:00:00.csv',
  'heatmap_23:15:00.csv',
  'heatmap_23:30:00.csv',
  'heatmap_23:45:00.csv',
];

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
      style: 'mapbox://styles/mapbox/dark-v9',
      playback: {
        curFileIndex: 0,
        minFrameRate: 0.1, // 10 seconds ome frame
        maxFrameRate: 10, // 10 frame per second
        frameRate: 1,  // frame per second
        title: DATE,
        playing: false,
        currentPlayed: ''
      }
    };
  }

  componentDidMount() {
    this._loadData();
    if (autoStartPlayback) {
      this._startPlay();
    }
  }

  _startPlay = () => {
    console.log('-XXX->_startPlay, ENTRY!');
    //this._stopPlay();
    this._timerId = setInterval(() => {
      if (this.state.playback.playing) {
        console.log('-XXX->_startPlay, load next file!');
        let nextFileIdx = this.state.playback.curFileIndex + 1;
        if (nextFileIdx < DATA_FILES.length) {
          const newPlaybackState = {
            ...this.state.playback,
            curFileIndex: nextFileIdx,
            playing: true
          }
          this.setState({ playback: newPlaybackState })
          this._loadData();
        } else {
          //auto stop play
          this._stopPlay();
        }
      }
    }, 1000 / this.state.playback.frameRate);
  }

  _stopPlay = () => {
    if (this._timerId !== null) {
      clearInterval(this._timerId);
      this._timerId = null;
      const newPlaybackState = {
        curFileIndex: 0,
        frameRate: 1,  // frame per second
        title: DATE,
        playing: false
      }
      this.setState({ playback: newPlaybackState });
    }
  }

  _resetPlay = () => {
    if (this._timerId !== null) {
      clearInterval(this._timerId);
      this._timerId = null;
    }
    this._startPlay();
  }

  _loadData = () => {
    const filePlayed = DATA_FILES[this.state.playback.curFileIndex];
    const file = DATA_PATH + filePlayed;
    d3.csv(file, d => {
      const point = ch.lv03.toWgs.point([d.x, d.y]);
      //console.log('-XXX->row=', d, ', point=', point);
      return { 
        position: point, counts: Number(d.score), 
      }; 
    })
    .then(data => {
      // data is now whole data set
      // draw chart in here!
      console.log('-XXX->data=', data);
      const newPlaybackState = {
        ...this.state.playback,
        currentPlayed: filePlayed
      }
      this.setState({
        points: data,
        playback: newPlaybackState
      });
      console.log('-XXX->state=', this.state);
    })
    .catch(error => {
      // handle error
      console.log('-XXX->', error);
    });
    // const points = /*heatmapData*/zurichData.reduce((accu, curr) => {
    //   accu.push({
    //     position: [Number(curr.longitude), Number(curr.latitude)],
    //     counts: curr.counts,
    //     //color: this._converColorHex(curr.color),
    //   });
    //   return accu;
    // }, []);
    // console.log('-XXX->_processData, points: ', points);
    // this.setState({
    //   points
    // });
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
    //const deck = this._deck;

    // const MapboxTraffic = require('@mapbox/mapbox-gl-traffic');
    const trafficPlugin = new MapboxTraffic({showTraffic: true});
    map.addControl(trafficPlugin);
    //trafficPlugin.toggleTraffic();

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

  _updatePlaybackSettings(settings) {
    //console.log('-XXX->_updatePlaybackSettings, ', settings);
    this.setState({playback: settings});
    this._resetPlay();
  }

  _onPlayBtnClicked = () => {
    //toggle play/pause
    const playing = this.state.playback.playing;
    console.log('-XXX->_onPlayBtnClicked, currently playing=', playing);
    const newPlaybackState = {
      ...this.state.playback,
      playing: !playing
    }
    this.setState({ playback: newPlaybackState });
    if (!this._timerId) {
      this._startPlay();
    }
  }

  render() {
    const data = this.state.points;
    if (!data.length) {
      return null;
    }
    const { hover, settings, gl, playback } = this.state;
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
        {showPlaybackControl &&
        <PlaybackControl
          settings={playback}
          onChange={settings => this._updatePlaybackSettings(settings)}
          onClick={this._onPlayBtnClicked}
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
