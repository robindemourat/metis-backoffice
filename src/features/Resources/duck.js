/**
 * This module exports logic-related elements for the resources feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/Resources
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
export const GET_RESOURCES = 'GET_RESOURCES';
export const GET_RESOURCE = 'GET_RESOURCE';
export const CREATE_RESOURCE = 'CREATE_RESOURCE';
export const DELETE_RESOURCE = 'DELETE_RESOURCE';
export const UPDATE_RESOURCE = 'UPDATE_RESOURCE';

export const PROMPT_NEW_RESOURCE_FORM = 'PROMPT_NEW_RESOURCE_FORM';
export const UNPROMPT_NEW_RESOURCE_FORM = 'UNPROMPT_NEW_RESOURCE_FORM';

export const SET_EDITED_RESOURCE = 'SET_EDITED_RESOURCE';
export const UNSET_EDITED_RESOURCE = 'UNSET_EDITED_RESOURCE';

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
export const getResources = () => ({
  type: GET_RESOURCES,
  promise: () =>
    get('resources')
});

export const getResource = (id) => ({
  type: GET_RESOURCE,
  promise: () =>
    get('resources', {id})
});

export const createResource = (resource) => ({
  type: CREATE_RESOURCE,
  promise: () =>
    post('resources', undefined, resource)
});

export const updateResource = (id, resource) => ({
  type: UPDATE_RESOURCE,
  promise: () =>
    put('resources', {id}, resource)
});

export const deleteResource = (id) => ({
  type: DELETE_RESOURCE,
  promise: () =>
    del('resources', {id})
      .then(() => get('resources'))
});

/*
 * Ui
 */
export const promptNewResourceForm = () => ({
  type: PROMPT_NEW_RESOURCE_FORM
});

export const unpromptNewResourceForm = () => ({
  type: UNPROMPT_NEW_RESOURCE_FORM
});

export const setEditedResource = resource => ({
  type: SET_EDITED_RESOURCE,
  resource
});

export const unsetEditedResource = () => ({
  type: UNSET_EDITED_RESOURCE
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

  newResourcePrompted: false,
  editedResource: undefined,
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

    case GET_RESOURCES:
    case CREATE_RESOURCE:
    case UPDATE_RESOURCE:
    case DELETE_RESOURCE:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_RESOURCES}_SUCCESS`:
    case `${CREATE_RESOURCE}_SUCCESS`:
    case `${UPDATE_RESOURCE}_SUCCESS`:
    case `${DELETE_RESOURCE}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${GET_RESOURCES}_FAIL`:
    case `${CREATE_RESOURCE}_FAIL`:
    case `${UPDATE_RESOURCE}_FAIL`:
    case `${DELETE_RESOURCE}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_RESOURCES}_RESET`:
    case `${CREATE_RESOURCE}_RESET`:
    case `${UPDATE_RESOURCE}_RESET`:
    case `${DELETE_RESOURCE}_RESET`:
      return {
        ...state,
        clientStatus: '',
        clientOperation: '',
      };

    case PROMPT_NEW_RESOURCE_FORM:
      return {
        ...state,
        newResourcePrompted: true,
      };

    case UNPROMPT_NEW_RESOURCE_FORM:
      return {
        ...state,
        newResourcePrompted: false,
      };

    case SET_EDITED_RESOURCE:
      return {
        ...state,
        editedResource: action.resource
      };
    case UNSET_EDITED_RESOURCE:
      return {
        ...state,
        editedResource: undefined
      };

    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  resources: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${CREATE_RESOURCE}_SUCCESS`:
      return {
        ...state,
        resources: state.resources.concat(action.result.data)
      };

    case `${DELETE_RESOURCE}_SUCCESS`:
      const deleted = action.result.data;
      return {
        ...state,
        resources: state.resources.filter(
                    resource =>
                      deleted.find(
                        otherResource =>
                          otherResource._id === resource._id
                        ) !== undefined
                  )
      };

    case `${GET_RESOURCE}_SUCCESS`:
      const a = action.result.data;
      return {
        ...state,
        resources: state.resources
                    .filter(resource => resource._id !== a._id)
                    .concat(a),
      };

    case `${GET_RESOURCES}_SUCCESS`:
      return {
        ...state,
        resources: action.result.data
      };

    case `${UPDATE_RESOURCE}_SUCCESS`:
      const newResource = action.result.data;
      return {
        ...state,
        resources: state.resources.map(resource => {
          if (resource._id === newResource._id) {
            return newResource;
          }
          else {
            return resource;
          }
        }),
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
const newResourcePrompted = state => state.ui.newResourcePrompted;

const resources = state => state.data.resources;
const editedResource = state => state.ui.editedResource;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  resources,
  clientOperation,
  clientStatus,
  editedResource,
  newResourcePrompted,
});
