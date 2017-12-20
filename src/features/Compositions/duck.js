/**
 * This module exports logic-related elements for the compositions feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module backoffice/features/Compositions
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {get, put, post, del} from '../../helpers/client';
import {createNewComposition} from '../../helpers/seeders';

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
export const GET_COMPOSITIONS = 'GET_COMPOSITIONS';
export const GET_COMPOSITION = 'GET_COMPOSITION';
export const CREATE_COMPOSITION = 'CREATE_COMPOSITION';
export const DELETE_COMPOSITION = 'DELETE_COMPOSITION';
export const UPDATE_COMPOSITION = 'UPDATE_COMPOSITION';

export const PROMPT_NEW_COMPOSITION_FORM = 'PROMPT_NEW_COMPOSITION_FORM';
export const UNPROMPT_NEW_COMPOSITION_FORM = 'UNPROMPT_NEW_COMPOSITION_FORM';

export const SET_EDITED_COMPOSITION = 'SET_EDITED_COMPOSITION';
export const UNSET_EDITED_COMPOSITION = 'UNSET_EDITED_COMPOSITION';

export const SET_EDITED_METADATA = 'SET_EDITED_METADATA';
export const UNSET_EDITED_METADATA = 'UNSET_EDITED_METADATA';

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
export const getCompositions = () => ({
  type: GET_COMPOSITIONS,
  promise: () =>
    get('compositions')
});

export const getComposition = (id) => ({
  type: GET_COMPOSITION,
  promise: () =>
    get('compositions', {id})
});

export const createComposition = (composition) => ({
  type: CREATE_COMPOSITION,
  promise: () =>
    post('compositions', undefined, composition)
});

export const updateComposition = (id, composition) => ({
  type: UPDATE_COMPOSITION,
  promise: () =>
    put('compositions', {id}, composition)
});

export const deleteComposition = (id) => ({
  type: DELETE_COMPOSITION,
  promise: () =>
    del('compositions', {id})
      .then(() => get('compositions'))
});

/*
 * Ui
 */
export const promptNewCompositionForm = () => ({
  type: PROMPT_NEW_COMPOSITION_FORM
})

export const unpromptNewCompositionForm = () => ({
  type: UNPROMPT_NEW_COMPOSITION_FORM
})

export const setEditedComposition = composition => ({
  type: SET_EDITED_COMPOSITION,
  composition
})

export const unsetEditedComposition = () => ({
  type: UNSET_EDITED_COMPOSITION
})

export const setEditedMetadata = metadata => ({
  type: SET_EDITED_METADATA,
  metadata
})

export const unsetEditedMetadata = () => ({
  type: UNSET_EDITED_METADATA
})

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
 * Default/fallback state of the compositions ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,

  newCompositionPrompted: false,
  editedComposition: undefined,
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

    case GET_COMPOSITIONS:
    case CREATE_COMPOSITION:
    case UPDATE_COMPOSITION:
    case DELETE_COMPOSITION:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_COMPOSITIONS}_SUCCESS`:
    case `${CREATE_COMPOSITION}_SUCCESS`:
    case `${DELETE_COMPOSITION}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };
    case `${UPDATE_COMPOSITION}_SUCCESS`:
      const newComposition = action.result.data;
      return {
        ...state,
        clientStatus: 'success',
        editedComposition: state.editedComposition && newComposition._id === state.editedComposition._id ?
          newComposition
          : state.editedComposition
      };

    case `${GET_COMPOSITIONS}_FAIL`:
    case `${CREATE_COMPOSITION}_FAIL`:
    case `${UPDATE_COMPOSITION}_FAIL`:
    case `${DELETE_COMPOSITION}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_COMPOSITIONS}_RESET`:
    case `${CREATE_COMPOSITION}_RESET`:
    case `${UPDATE_COMPOSITION}_RESET`:
    case `${DELETE_COMPOSITION}_RESET`:
      return {
        ...state,
        clientStatus: '',
        clientOperation: '',
      };

    case PROMPT_NEW_COMPOSITION_FORM:
      return {
        ...state,
        newCompositionPrompted: true,
      };

    case UNPROMPT_NEW_COMPOSITION_FORM:
      return {
        ...state,
        newCompositionPrompted: false,
      };

    case SET_EDITED_COMPOSITION:
      return {
        ...state,
        editedComposition: action.composition
      };
    case UNSET_EDITED_COMPOSITION:
      return {
        ...state,
        editedComposition: undefined
      };

    case SET_EDITED_METADATA:
      return {
        ...state,
        editedMetadata: action.metadata
      };
    case UNSET_EDITED_METADATA:
      return {
        ...state,
        editedMetadata: undefined
      };

    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  compositions: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${CREATE_COMPOSITION}_SUCCESS`:
      return {
        ...state,
        compositions: state.compositions.concat(action.result.data)
      };

    case `${DELETE_COMPOSITION}_SUCCESS`:
      const deleted = action.result.data;
      return {
        ...state,
        compositions: state.compositions.filter(
                    composition =>
                      deleted.find(
                        otherComposition =>
                          otherComposition._id === composition._id
                        ) !== undefined
                  )
      };

    case `${GET_COMPOSITION}_SUCCESS`:
      const a = action.result.data;
      return {
        ...state,
        compositions: state.compositions
                    .filter(composition => composition._id !== a._id)
                    .concat(a),
      };

    case `${GET_COMPOSITIONS}_SUCCESS`:
      return {
        ...state,
        compositions: action.result.data
      };

    case `${UPDATE_COMPOSITION}_SUCCESS`:
      const newComposition = action.result.data;
      return {
        ...state,
        compositions: state.compositions.map(composition => {
          if (composition._id === newComposition._id) {
            return newComposition;
          }
          else {
            return composition;
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
const newCompositionPrompted = state => state.ui.newCompositionPrompted;

const compositions = state => state.data.compositions;
const editedComposition = state => state.ui.editedComposition;
const editedMetadata = state => state.ui.editedMetadata;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  compositions,
  clientOperation,
  clientStatus,
  editedComposition,
  editedMetadata,
  newCompositionPrompted,
});
