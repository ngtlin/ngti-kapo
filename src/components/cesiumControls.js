import React, { Component } from 'react';
import { cesiumControl } from './style';


class CesiumControls extends Component {

  render() {
    return (
      <div className="cesium-controls" style={cesiumControl}>
        <button>Click Me</button>
      </div>
    );
  }
}

export default CesiumControls;