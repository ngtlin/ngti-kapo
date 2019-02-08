import React, { Component } from 'react';

import { playbackControl } from './style';

import './controls.css';


export default class PlaybackControl extends Component {
  _onSpeedChange = (settingName, newValue) => {
    const { settings } = this.props;
    //console.log('-XXX->settings change, ', settingName, newValue);
    // Only update if we have a confirmed change
    if (settings.frameRate !== newValue) {
      // Create a new object so that shallow-equal detects a change
      const newSettings = {
        ...this.props.settings,
        frameRate: newValue
      };

      this.props.onChange(newSettings);
    }
  }

  _onClick = () => {
    //console.log('-XXX->play button clicked, ', this.props);
    if (this.props.onClick) {
      this.props.onClick();
    }
  }

  render() {
    const { settings } = this.props;
    console.log('-XXX->Playback, settings=', settings);
    const frameRateSliderProps = {
      settingName: 'Speed',
      value: settings.frameRate,
      min: settings.minFrameRate,
      max: settings.maxFrameRate,
      onChange: this._onSpeedChange
    }

    return (
      <div className='playback-control' style={playbackControl}>
        {settings.title && <h3>{settings.title}</h3>}
        <button className='button button--primary' id="play" type="button" onClick={this._onClick}>{settings.playing ? 'Pause' : 'Play'}</button>
        <div className='speed-slider'>
          <label className='speed-name'>Speed</label>
          <Slider {...frameRateSliderProps} />
        </div>
        <span id="info">{settings.currentPlayed}</span>
      </div>
    );
  }
}

const Slider = ({ settingName, value, max, min, onChange}) => {
  const maxValue = max ? max : 100;
  const minValue = min ? min : 0;

  return (
    <div className="input-group">
      <div>
        <input
          type="range"
          id={settingName}
          min={0}
          max={maxValue}
          step={minValue / 100}
          value={value}
          onChange={e => onChange(settingName, Number(e.target.value))}
        />
      </div>
    </div>
  );
};
