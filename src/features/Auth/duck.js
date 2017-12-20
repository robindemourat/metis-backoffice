/**
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module backoffice/features/GlobalUi
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {post} from '../../helpers/client';

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
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
export const CHANGE_PASSWORD = 'CHANGE_PASSWORD';
export const SIGN_UP = 'SIGN_UP';

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
export const login = (body) => ({
  type: LOGIN,
  promise: () =>
    post('login', undefined, body)
});

export const logout = () => ({
  type: LOGOUT
});

export const forgetUser = () => ({
  type: LOGOUT
});


export const signUp = (body) => ({
  type: SIGN_UP,
  promise: () =>
    post('signUp', undefined, body)
});

export const requestPasswordReset = (email) => ({
  type: REQUEST_PASSWORD_RESET,
  promise: () =>
    post('requestPasswordReset', undefined, {email})
});

export const changePassword = (values) => ({
  type: CHANGE_PASSWORD,
  promise: () =>
    post('changePassword', undefined, values)
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
 * Default/fallback state of the auth ui state
 */
const UI_DEFAULT_STATE = {
  clientStatus: undefined,
  clientOperation: undefined,
  success: undefined,
  isLoading: false,
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui(state = UI_DEFAULT_STATE, action) {
  switch (action.type) {

    case LOGIN:
    case CHANGE_PASSWORD :
    case REQUEST_PASSWORD_RESET:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,
      };

    case `${LOGIN}_FAIL`:
    case `${CHANGE_PASSWORD}_FAIL`:
    case `${REQUEST_PASSWORD_RESET}_FAIL`:
      return {
        ...state,
        clientStatus: 'error'
      };

    case `${LOGIN}_SUCCESS`:
    case `${CHANGE_PASSWORD}_SUCCESS`:
    case `${REQUEST_PASSWORD_RESET}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${LOGIN}_RESET`:
    case `${CHANGE_PASSWORD}_RESET`:
    case `${REQUEST_PASSWORD_RESET}_RESET`:
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
  token: localStorage.getItem('token') || undefined,
  user: localStorage.getItem('user') !== null && localStorage.getItem('user') !== 'undefined' && JSON.parse(localStorage.getItem('user')) || undefined,
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case LOGOUT:
      localStorage.setItem('token', undefined);
      localStorage.setItem('user', undefined);
      return {
        ...state,
        token: undefined,
        user: undefined,
      };

    case CHANGE_PASSWORD + '_SUCCESS':
      const user = action.result.data;
      return {
        ...state,
        user
      };

    case LOGIN + '_SUCCESS':
    case SIGN_UP + '_SUCCESS':
      const thatData = action.result.data;
      if (thatData.success) {
        const serialized = JSON.stringify(thatData.user);
        localStorage.setItem('token', thatData.token);
        localStorage.setItem('user', serialized);
        return {
          ...state,
          token: thatData.token,
          user: thatData.user
        };
      }
      return state;

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
const clientOperation = state => state.ui.clientOperation;
const clientStatus = state => state.ui.clientStatus;
const token = state => state.data.token;
const user = state => state.data.user;
const isAdmin = state => state.data.user && state.data.admin;
const isLoading = state => state.ui.isLoading;
/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  clientOperation,
  clientStatus,

  isLoading,
  token,
  user,
  isAdmin,
});
