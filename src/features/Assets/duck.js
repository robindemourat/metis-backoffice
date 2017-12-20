/**
 * This module exports logic-related elements for the assets feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module backoffice/features/Assets
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {get, put, post, del} from '../../helpers/client';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action names
 * ===========
 * ===========
 * ===========
 * ===========
 */
export const GET_ASSETS = 'GET_ASSETS';
export const CREATE_ASSET = 'CREATE_ASSET';
export const UPDATE_ASSET = 'UPDATE_ASSET';
export const DELETE_ASSET = 'DELETE_ASSET';

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Action creators
 * ===========
 * ===========
 * ===========
 * ===========
 */
export const getAssets = () => ({
  type: GET_ASSETS,
  promise: () =>
    get('assets')
});

export const createAsset = (fileName, thatData, config) => ({
  type: CREATE_ASSET,
  promise: () =>
    post('assets', {
      ...config,
      id: encodeURIComponent(fileName)
    }, thatData)
});

export const updateAsset = (assetId, thatData, config) => ({
  type: UPDATE_ASSET,
  promise: () =>
    put('assets', {
      ...config,
      id: assetId
    }, thatData)
});

export const deleteAsset = (id) => ({
  type: DELETE_ASSET,
  promise: () =>
    del('assets', {id})
      .then(() => get('assets'))
});

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Reducers
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * Default/fallback state of the ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: '',
  clientStatus: ''
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui(state = UI_DEFAULT_STATE, action) {
  switch (action.type) {

    case GET_ASSETS:
    case CREATE_ASSET:
    case UPDATE_ASSET:
    case DELETE_ASSET:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,
      };

    case `${GET_ASSETS}_SUCCESS`:
    case `${CREATE_ASSET}_SUCCESS`:
    case `${UPDATE_ASSET}_SUCCESS`:
    case `${DELETE_ASSET}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${GET_ASSETS}_FAIL`:
    case `${CREATE_ASSET}_FAIL`:
    case `${UPDATE_ASSET}_FAIL`:
    case `${DELETE_ASSET}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_ASSETS}_RESET`:
    case `${UPDATE_ASSET}_RESET`:
    case `${DELETE_ASSET}_RESET`:
      return {
        ...state,
        clientStatus: '',
        clientOperation: '',
      };

    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  assets: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case CREATE_ASSET + '_SUCCESS':
      return {
        ...state,
        assets: state.assets.concat(action.result.data)
      };

    case UPDATE_ASSET + '_SUCCESS':
      const asset = action.result.data;
      return {
        ...state,
        assets: state.assets.map(other => {
          if (other._id === asset._id) {
            return asset;
          }
          return other;
        })
      };


    case DELETE_ASSET + '_SUCCESS':
      return {
        ...state,
        assets: action.result.data
      };

    case GET_ASSETS + '_SUCCESS':
      return {
        ...state,
        assets: action.result.data
      };

    default:
      return state;
  }
}

/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Exported reducer
 * ===========
 * ===========
 * ===========
 * ===========
 */

/**
 * The module exports a reducer
 */
export default combineReducers({
  ui,
  data
});


/*
 * ===========
 * ===========
 * ===========
 * ===========
 * Selectors
 * ===========
 * ===========
 * ===========
 * ===========
 */
/**
 * Selectors related to global ui
 */
const clientStatus = state => state.ui.clientStatus;
const clientOperation = state => state.ui.clientOperation;
const assets = state => state.data.assets;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  assets,
  clientStatus,
  clientOperation,
});
