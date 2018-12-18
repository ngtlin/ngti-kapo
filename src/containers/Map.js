import React, { Component } from 'react';
import MapGL, {NavigationControl} from 'react-map-gl';

import { MapStylePicker } from '../components/controls';
//import { connect } from 'react-redux';
//import './App.css';

console.log('-XXX->MapBox token=', process.env.MapboxAccessToken);
//const MAPBOX_TOKEN = process.env.MapboxAccessToken;
const MAPBOX_TOKEN = 'pk.eyJ1IjoidWJlcmRhdGEiLCJhIjoiY2o4OW90ZjNuMDV6eTMybzFzbmc3bWpvciJ9.zfRO_nfL1O3d2EuoNtE_NQ';

const navStyle = {
  position: 'absolute',
  top: 0,
  right: 10,
  padding: '10px'
};

class Map extends Component {

  constructor (props) {
    super(props);

    this.state = {
      style: 'mapbox://styles/mapbox/light-v9',
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: 8.542551, //zurich
        latitude: 47.369972,
        zoom: 12,
        maxZoom: 18,
        pitch: 0,
        bearing: 0
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    this._onViewportChange({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  onStyleChange = (style) => {
    this.setState({style});
  }

  _onViewportChange = (viewport) => {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport }
    });
  }


  render() {
    return (
      <div>
        <MapStylePicker onStyleChange={this.onStyleChange} currentStyle={this.state.style}/>
        <MapGL
          mapboxApiAccessToken={MAPBOX_TOKEN}
          {...this.state.viewport}
          mapStyle={this.state.style}
          onViewportChange={viewport => this._onViewportChange(viewport)}
        >
          <div className="nav" style={navStyle}>
            <NavigationControl onViewportChange={this._onViewportChange} />
          </div>
        </MapGL>
      </div>
    );
  }
}

export default Map;
