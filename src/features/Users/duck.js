/**
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/GlobalUi
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
export const GET_USERS = 'GET_USERS';
export const GET_USER = 'GET_USER';
export const CREATE_USER = 'CREATE_USER';
export const DELETE_USER = 'DELETE_USER';
export const UPDATE_USER = 'UPDATE_USER';

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
export const getUsersList = () => ({
  type: GET_USERS,
  promise: () =>
    get('users')
});

export const getUser = (id) => ({
  type: GET_USER,
  promise: () =>
    get('users', {id})
});

export const createUser = (user) => ({
  type: CREATE_USER,
  promise: () =>
    post('users', undefined, user)
});

export const updateUser = (id, user) => ({
  type: UPDATE_USER,
  promise: () =>
    put('users', {id}, user)
});

export const deleteUser = (id) => ({
  type: DELETE_USER,
  promise: () =>
    del('users', {id})
      .then(() => get('users'))
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
 * Default/fallback state of the users ui state
 */
const UI_DEFAULT_STATE = {
  clientStatus: undefined,
  clientOperation: undefined,
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function ui(state = UI_DEFAULT_STATE, action) {
  switch (action.type) {

    case GET_USER:
    case GET_USERS:
    case CREATE_USER:
    case UPDATE_USER:
    case DELETE_USER:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,
      };

    case `${GET_USER}_SUCCESS`:
    case `${GET_USERS}_SUCCESS`:
    case `${CREATE_USER}_SUCCESS`:
    case `${UPDATE_USER}_SUCCESS`:
    case `${DELETE_USER}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${GET_USER}_FAIL`:
    case `${GET_USERS}_FAIL`:
    case `${CREATE_USER}_FAIL`:
    case `${UPDATE_USER}_FAIL`:
    case `${DELETE_USER}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_USER}_RESET`:
    case `${GET_USERS}_RESET`:
    case `${CREATE_USER}_RESET`:
    case `${UPDATE_USER}_RESET`:
    case `${DELETE_USER}_RESET`:
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
  users: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case CREATE_USER + '_SUCCESS':
      return {
        ...state,
        users: action.result.data
      };

    case DELETE_USER + '_SUCCESS':
      const deleted = action.result.data;
      return {
        ...state,
        users: state.users.filter(a => deleted.find(b => b._id === a._id) !== undefined)
      };

    case GET_USER + '_SUCCESS':
      const a = action.result.data;
      return {
        ...state,
        users: state.users
                    .filter(user => user._id !== a._id)
                    .concat(a),
        editedUser: a,
      };

    case GET_USERS + '_SUCCESS':
      return {
        ...state,
        users: action.result.data
      };

    case UPDATE_USER + '_SUCCESS':
      const newUser = action.result.data;
      return {
        ...state,
        users: state.users.map(user =>
          user._id === newUser._id ? newUser : user /* eslint  no-confusing-arrow : 0 */
        ),
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
const users = state => state.data.users;
const editedUser = state => state.data.editedUser;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  clientStatus,
  clientOperation,

  users,
  editedUser,
});
