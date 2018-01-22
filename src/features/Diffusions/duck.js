/**
 * This module exports logic-related elements for the diffusions feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/Diffusions
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {Diffusion as diffusionSchema} from 'metis-schemas';
import defaults from 'json-schema-defaults';

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
export const GET_DIFFUSIONS = 'GET_DIFFUSIONS';
export const GET_DIFFUSION = 'GET_DIFFUSION';
export const CREATE_DIFFUSION = 'CREATE_DIFFUSION';
export const DELETE_DIFFUSION = 'DELETE_DIFFUSION';
export const UPDATE_DIFFUSION = 'UPDATE_DIFFUSION';

export const PROMPT_NEW_DIFFUSION_FORM = 'PROMPT_NEW_DIFFUSION_FORM';
export const UNPROMPT_NEW_DIFFUSION_FORM = 'UNPROMPT_NEW_DIFFUSION_FORM';

export const SET_EDITED_DIFFUSION = 'SET_EDITED_DIFFUSION';
export const UNSET_EDITED_DIFFUSION = 'UNSET_EDITED_DIFFUSION';

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
export const getDiffusions = () => ({
  type: GET_DIFFUSIONS,
  promise: () =>
    get('diffusions')
});

export const getDiffusion = (id) => ({
  type: GET_DIFFUSION,
  promise: () =>
    get('diffusions', {id})
});

export const createDiffusion = (diffusion) => ({
  type: CREATE_DIFFUSION,
  promise: () =>
    post('diffusions', undefined, diffusion)
});

export const updateDiffusion = (id, diffusion) => ({
  type: UPDATE_DIFFUSION,
  promise: () =>
    put('diffusions', {id}, diffusion)
});

export const deleteDiffusion = (id) => ({
  type: DELETE_DIFFUSION,
  promise: () =>
    del('diffusions', {id})
      .then(() => get('diffusions'))
});

/*
 * Ui
 */
export const promptNewDiffusionForm = (montageId, montageType) => ({
  type: PROMPT_NEW_DIFFUSION_FORM,
  montageId,
  montageType
});

export const unpromptNewDiffusionForm = () => ({
  type: UNPROMPT_NEW_DIFFUSION_FORM
});

export const setEditedDiffusion = diffusion => ({
  type: SET_EDITED_DIFFUSION,
  diffusion
});

export const unsetEditedDiffusion = () => ({
  type: UNSET_EDITED_DIFFUSION
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
 * Default/fallback state of the diffusions ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,

  newDiffusionPrompted: false,
  editedDiffusion: undefined,
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

    case GET_DIFFUSIONS:
    case CREATE_DIFFUSION:
    case UPDATE_DIFFUSION:
    case DELETE_DIFFUSION:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_DIFFUSIONS}_SUCCESS`:
    case `${CREATE_DIFFUSION}_SUCCESS`:
    case `${DELETE_DIFFUSION}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };
    case `${UPDATE_DIFFUSION}_SUCCESS`:
      const newDiffusion = action.result.data;
      return {
        ...state,
        clientStatus: 'success',
        editedDiffusion: state.editedDiffusion && newDiffusion._id === state.editedDiffusion._id ?
          newDiffusion
          : state.editedDiffusion
      };

    case `${GET_DIFFUSIONS}_FAIL`:
    case `${CREATE_DIFFUSION}_FAIL`:
    case `${UPDATE_DIFFUSION}_FAIL`:
    case `${DELETE_DIFFUSION}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_DIFFUSIONS}_RESET`:
    case `${CREATE_DIFFUSION}_RESET`:
    case `${UPDATE_DIFFUSION}_RESET`:
    case `${DELETE_DIFFUSION}_RESET`:
      return {
        ...state,
        clientStatus: '',
        clientOperation: '',
      };

    case PROMPT_NEW_DIFFUSION_FORM:
      return {
        ...state,
        newDiffusionPrompted: true,
        editedDiffusion: {
          ...defaults(diffusionSchema),
          montage_id: action.montageId,
          montage_type: action.montageType,
        }
      };

    case UNPROMPT_NEW_DIFFUSION_FORM:
      return {
        ...state,
        newDiffusionPrompted: false,
        editedDiffusion: undefined
      };

    case SET_EDITED_DIFFUSION:
      return {
        ...state,
        editedDiffusion: action.diffusion
      };
    case UNSET_EDITED_DIFFUSION:
      return {
        ...state,
        editedDiffusion: undefined
      };

    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  diffusions: [],
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${CREATE_DIFFUSION}_SUCCESS`:
      return {
        ...state,
        diffusions: state.diffusions.concat(action.result.data)
      };

    case `${DELETE_DIFFUSION}_SUCCESS`:
      const deleted = action.result.data;
      return {
        ...state,
        diffusions: state.diffusions.filter(
                    diffusion =>
                      deleted.find(
                        otherDiffusion =>
                          otherDiffusion._id === diffusion._id
                        ) !== undefined
                  )
      };

    case `${GET_DIFFUSION}_SUCCESS`:
      const a = action.result.data;
      return {
        ...state,
        diffusions: state.diffusions
                    .filter(diffusion => diffusion._id !== a._id)
                    .concat(a),
      };

    case `${GET_DIFFUSIONS}_SUCCESS`:
      return {
        ...state,
        diffusions: action.result.data
      };

    case `${UPDATE_DIFFUSION}_SUCCESS`:
      const newDiffusion = action.result.data;
      return {
        ...state,
        diffusions: state.diffusions.map(diffusion => {
          if (diffusion._id === newDiffusion._id) {
            return newDiffusion;
          }
          else {
            return diffusion;
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
const newDiffusionPrompted = state => state.ui.newDiffusionPrompted;

const diffusions = state => state.data.diffusions;
const editedDiffusion = state => state.ui.editedDiffusion;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  diffusions,
  clientOperation,
  clientStatus,
  editedDiffusion,
  newDiffusionPrompted,
});
