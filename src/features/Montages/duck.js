/**
 * This module exports logic-related elements for the montages feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module backoffice/features/Montages
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
export const GET_MONTAGES = 'GET_MONTAGES';
export const GET_MONTAGE = 'GET_MONTAGE';
export const CREATE_MONTAGE = 'CREATE_MONTAGE';
export const DELETE_MONTAGE = 'DELETE_MONTAGE';
export const UPDATE_MONTAGE = 'UPDATE_MONTAGE';

export const PROMPT_NEW_MONTAGE_FORM = 'PROMPT_NEW_MONTAGE_FORM';
export const UNPROMPT_NEW_MONTAGE_FORM = 'UNPROMPT_NEW_MONTAGE_FORM';

export const SET_EDITED_MONTAGE = 'SET_EDITED_MONTAGE';
export const UNSET_EDITED_MONTAGE = 'UNSET_EDITED_MONTAGE';

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
export const getMontages = () => ({
  type: GET_MONTAGES,
  promise: () =>
    get('montages')
});

export const getMontage = (id) => ({
  type: GET_MONTAGE,
  promise: () =>
    get('montages', {id})
});

export const createMontage = (montage) => ({
  type: CREATE_MONTAGE,
  promise: () =>
    post('montages', undefined, montage)
});

export const updateMontage = (id, montage) => ({
  type: UPDATE_MONTAGE,
  promise: () =>
    put('montages', {id}, montage)
});

export const deleteMontage = (id) => ({
  type: DELETE_MONTAGE,
  promise: () =>
    del('montages', {id})
      .then(() => get('montages'))
});

/*
 * Ui
 */
export const promptNewMontageForm = () => ({
  type: PROMPT_NEW_MONTAGE_FORM
});

export const unpromptNewMontageForm = () => ({
  type: UNPROMPT_NEW_MONTAGE_FORM
});

export const setEditedMontage = montage => ({
  type: SET_EDITED_MONTAGE,
  montage
});

export const unsetEditedMontage = () => ({
  type: UNSET_EDITED_MONTAGE
});

export const setEditedMetadata = metadata => ({
  type: SET_EDITED_METADATA,
  metadata
});

export const unsetEditedMetadata = () => ({
  type: UNSET_EDITED_METADATA
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
 * Default/fallback state of the montages ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,

  newMontagePrompted: false,
  editedMontage: undefined,
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

    case GET_MONTAGES:
    case CREATE_MONTAGE:
    case UPDATE_MONTAGE:
    case DELETE_MONTAGE:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_MONTAGES}_SUCCESS`:
    case `${CREATE_MONTAGE}_SUCCESS`:
    case `${DELETE_MONTAGE}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };
    case `${UPDATE_MONTAGE}_SUCCESS`:
      const newMontage = action.result.data;
      return {
        ...state,
        clientStatus: 'success',
        editedMontage: state.editedMontage && newMontage._id === state.editedMontage._id ?
          newMontage
          : state.editedMontage
      };

    case `${GET_MONTAGES}_FAIL`:
    case `${CREATE_MONTAGE}_FAIL`:
    case `${UPDATE_MONTAGE}_FAIL`:
    case `${DELETE_MONTAGE}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_MONTAGES}_RESET`:
    case `${CREATE_MONTAGE}_RESET`:
    case `${UPDATE_MONTAGE}_RESET`:
    case `${DELETE_MONTAGE}_RESET`:
      return {
        ...state,
        clientStatus: '',
        clientOperation: '',
      };

    case PROMPT_NEW_MONTAGE_FORM:
      return {
        ...state,
        newMontagePrompted: true,
      };

    case UNPROMPT_NEW_MONTAGE_FORM:
      return {
        ...state,
        newMontagePrompted: false,
      };

    case SET_EDITED_MONTAGE:
      return {
        ...state,
        editedMontage: action.montage
      };
    case UNSET_EDITED_MONTAGE:
      return {
        ...state,
        editedMontage: undefined
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
  montages: [],
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${CREATE_MONTAGE}_SUCCESS`:
      return {
        ...state,
        montages: state.montages.concat(action.result.data)
      };

    case `${DELETE_MONTAGE}_SUCCESS`:
      const deleted = action.result.data;
      return {
        ...state,
        montages: state.montages.filter(
                    montage =>
                      deleted.find(
                        otherMontage =>
                          otherMontage._id === montage._id
                        ) !== undefined
                  )
      };

    case `${GET_MONTAGE}_SUCCESS`:
      const a = action.result.data;
      return {
        ...state,
        montages: state.montages
                    .filter(montage => montage._id !== a._id)
                    .concat(a),
      };

    case `${GET_MONTAGES}_SUCCESS`:
      return {
        ...state,
        montages: action.result.data
      };

    case `${UPDATE_MONTAGE}_SUCCESS`:
      const newMontage = action.result.data;
      return {
        ...state,
        montages: state.montages.map(montage => {
          if (montage._id === newMontage._id) {
            return newMontage;
          }
          else {
            return montage;
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
const newMontagePrompted = state => state.ui.newMontagePrompted;

const montages = state => state.data.montages;
const editedMontage = state => state.ui.editedMontage;
const editedMetadata = state => state.ui.editedMetadata;


/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  montages,
  clientOperation,
  clientStatus,
  editedMontage,
  editedMetadata,
  newMontagePrompted,

});
