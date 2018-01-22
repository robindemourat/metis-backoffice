/**
 * This module exports logic-related elements for the deliverables feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/Deliverables
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {get, del} from '../../helpers/client';

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
export const GET_DELIVERABLES = 'GET_DELIVERABLES';
export const DELETE_DELIVERABLE = 'DELETE_DELIVERABLE';

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
export const getDeliverables = () => ({
  type: GET_DELIVERABLES,
  promise: () =>
    get('deliverables')
});


export const deleteDeliverable = (id) => ({
  type: DELETE_DELIVERABLE,
  promise: () =>
    del('deliverables', {id})
      .then(() => get('deliverables'))
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
 * Default/fallback state of the deliverables ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,

  newDeliverablePrompted: false,
  editedDeliverable: undefined,
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

    case GET_DELIVERABLES:
    case DELETE_DELIVERABLE:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_DELIVERABLES}_SUCCESS`:
    case `${DELETE_DELIVERABLE}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${GET_DELIVERABLES}_FAIL`:
    case `${DELETE_DELIVERABLE}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_DELIVERABLES}_RESET`:
    case `${DELETE_DELIVERABLE}_RESET`:
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
  deliverables: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${GET_DELIVERABLES}_SUCCESS`:
      return {
        ...state,
        deliverables: action.result.data
      };

    case `${DELETE_DELIVERABLE}_SUCCESS`:
      return {
        ...state,
        deliverables: action.result.data
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
 * Selectors related to global ui
 */
const clientOperation = state => state.ui.clientOperation;
const clientStatus = state => state.ui.clientStatus;

const deliverables = state => state.data.deliverables;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  deliverables,
  clientOperation,
  clientStatus,
});
