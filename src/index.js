import React from 'react';
//import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
//import Map from './containers/Map';
import Cesium from './containers/Cesium';

import * as serviceWorker from './serviceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<Map />, document.getElementById('root'));
ReactDOM.render(<Cesium />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
