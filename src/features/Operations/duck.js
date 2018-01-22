/**
 * This module exports logic-related elements for the operations feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/Operations
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {post, delete as del} from 'axios';


import getConfig from '../../helpers/getConfig';
const {servicesBaseUri} = getConfig();


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
export const UPLOAD_DUMP = 'UPLOAD_DUMP';
export const DELETE_ALL_DATA = 'DELETE_ALL_DATA';

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

export const uploadDump = (thatData) => ({
  type: UPLOAD_DUMP,
  promise: () =>
    post(`${servicesBaseUri}/dump`, thatData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
});

export const deleteAllData = () => ({
  type: DELETE_ALL_DATA,
  promise: () =>
    del(`${servicesBaseUri}/dump`)
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
 * Default/fallback state of the resources ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 * @todo automate status messages management in all ui reducers
 */
function ui(state = UI_DEFAULT_STATE, action) {
  switch (action.type) {

    case UPLOAD_DUMP:
    case DELETE_ALL_DATA:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${UPLOAD_DUMP}_SUCCESS`:
    case `${DELETE_ALL_DATA}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${UPLOAD_DUMP}_FAIL`:
    case `${DELETE_ALL_DATA}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${UPLOAD_DUMP}_RESET`:
    case `${DELETE_ALL_DATA}_RESET`:
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
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

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
  data,
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
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
const dumpUrl = () => `${servicesBaseUri}/dump`;

const clientStatus = state => state.ui.clientStatus;
const clientOperation = state => state.ui.clientOperation;

export const selector = createStructuredSelector({
  dumpUrl,

  clientStatus,
  clientOperation,
});
