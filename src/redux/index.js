import {combineReducers, createStore, applyMiddleware, compose} from 'redux';
import {routerReducer, routerMiddleware} from 'react-router-redux';
import {hashHistory} from 'react-router';

import thunk from 'redux-thunk';
import window from 'global/window';
import {taskMiddleware} from 'react-palm/tasks';

import demoReducer from './reducers';

const reducers = combineReducers({
  demo: demoReducer,
  routing: routerReducer
});

export const middlewares = [
  taskMiddleware,
  thunk,
  routerMiddleware(hashHistory)
];

export const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default createStore(
  reducers,
  initialState,
  composeEnhancers(...enhancers)
);