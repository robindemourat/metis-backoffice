/**
 * This module exports logic-related elements for the compositions feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module metis-backoffice/features/Compositions
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
export const GET_COMPOSITIONS = 'GET_COMPOSITIONS';
export const GET_COMPOSITION = 'GET_COMPOSITION';
export const CREATE_COMPOSITION = 'CREATE_COMPOSITION';
export const DELETE_COMPOSITION = 'DELETE_COMPOSITION';
export const UPDATE_COMPOSITION = 'UPDATE_COMPOSITION';

export const PROMPT_NEW_COMPOSITION_FORM = 'PROMPT_NEW_COMPOSITION_FORM';
export const UNPROMPT_NEW_COMPOSITION_FORM = 'UNPROMPT_NEW_COMPOSITION_FORM';

export const PROMPT_ASSET_REQUEST = 'PROMPT_ASSET_REQUEST';
export const UNPROMPT_ASSET_REQUEST = 'UNPROMPT_ASSET_REQUEST';


export const SET_EDITED_COMPOSITION = 'SET_EDITED_COMPOSITION';
export const UNSET_EDITED_COMPOSITION = 'UNSET_EDITED_COMPOSITION';

export const SET_EDITED_METADATA = 'SET_EDITED_METADATA';
export const UNSET_EDITED_METADATA = 'UNSET_EDITED_METADATA';

export const UPDATE_DRAFT_EDITOR_STATE = 'UPDATE_DRAFT_EDITOR_STATE';
export const UPDATE_DRAFT_EDITORS_STATES = 'UPDATE_DRAFT_EDITORS_STATES';
export const SET_EDITOR_FOCUS = 'SET_EDITOR_FOCUS';
export const SET_PREVIEW_MODE = 'SET_PREVIEW_MODE';


export const CREATE_CONTEXTUALIZER = 'CREATE_CONTEXTUALIZER';
export const UPDATE_CONTEXTUALIZER = 'UPDATE_CONTEXTUALIZER';
export const DELETE_CONTEXTUALIZER = 'DELETE_CONTEXTUALIZER';

export const CREATE_CONTEXTUALIZATION = 'CREATE_CONTEXTUALIZATION';
export const UPDATE_CONTEXTUALIZATION = 'UPDATE_CONTEXTUALIZATION';
export const DELETE_CONTEXTUALIZATION = 'DELETE_CONTEXTUALIZATION';


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
});

export const unpromptNewCompositionForm = () => ({
  type: UNPROMPT_NEW_COMPOSITION_FORM
});

export const setEditedComposition = composition => ({
  type: SET_EDITED_COMPOSITION,
  composition
});

export const unsetEditedComposition = () => ({
  type: UNSET_EDITED_COMPOSITION
});

export const setEditedMetadata = metadata => ({
  type: SET_EDITED_METADATA,
  metadata
});

export const unsetEditedMetadata = () => ({
  type: UNSET_EDITED_METADATA
});

export const setPreviewMode = (previewMode) => ({
  type: SET_PREVIEW_MODE,
  previewMode
});

/**
 * Editor
 */
export const promptAssetRequest = (editorId, selection) => ({
  type: PROMPT_ASSET_REQUEST,
  editorId,
  selection
});

export const unpromptAssetRequest = () => ({
  type: UNPROMPT_ASSET_REQUEST
});

export const updateDraftEditorState = (id, editorState) => ({
  type: UPDATE_DRAFT_EDITOR_STATE,
  editorState,
  id,
});

export const updateDraftEditorsStates = editorsStates => ({
  type: UPDATE_DRAFT_EDITORS_STATES,
  editorsStates,
});

export const setEditorFocus = editorFocus => ({
  type: SET_EDITOR_FOCUS,
  editorFocus
});


/**
 * Creates a contextualizer
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @param {object} contextualizer  - new contextualizer data
 * @return {object} action - the redux action to dispatch
 */
export const createContextualizer = (contextualizerId, contextualizer) => ({
  type: CREATE_CONTEXTUALIZER,
  contextualizerId,
  contextualizer
});

/**
 * Updates a contextualizer
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @param {object} contextualizer  - new contextualizer data
 * @return {object} action - the redux action to dispatch
 */
export const updateContextualizer = (contextualizerId, contextualizer) => ({
  type: UPDATE_CONTEXTUALIZER,
  contextualizerId,
  contextualizer
});

/**
 * Deletes a contextualizer
 * @param {string} contextualizerId  - id of the contextualizer to update
 * @return {object} action - the redux action to dispatch
 */
export const deleteContextualizer = (contextualizerId) => ({
  type: DELETE_CONTEXTUALIZER,
  contextualizerId
});

/**
 * Creates a contextualization
 * @param {string} contextualizationId  - id of the contextualization to update
 * @param {object} contextualization  - new contextualization data
 * @return {object} action - the redux action to dispatch
 */
export const createContextualization = (contextualizationId, contextualization) => ({
  type: CREATE_CONTEXTUALIZATION,
  contextualizationId,
  contextualization
});

/**
 * Updates a contextualization
 * @param {string} storyId  - id of the story to update
 * @param {string} contextualizationId  - id of the contextualization to update
 * @param {object} contextualization  - new contextualization data
 * @return {object} action - the redux action to dispatch
 */
export const updateContextualization = (contextualizationId, contextualization) => ({
  type: UPDATE_CONTEXTUALIZATION,
  contextualizationId,
  contextualization
});

/**
 * Deletes a contextualization
 * @param {string} contextualizationId  - id of the contextualization to update
 * @return {object} action - the redux action to dispatch
 */
export const deleteContextualization = (contextualizationId) => ({
  type: DELETE_CONTEXTUALIZATION,
  contextualizationId
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
 * Default/fallback state of the compositions ui state
 */
const UI_DEFAULT_STATE = {
  clientOperation: undefined,
  clientStatus: undefined,

  newCompositionPrompted: false,
  editedComposition: undefined,
  previewMode: 'web',
};
/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 * @todo automate status messages management in all ui reducers
 */
function ui(state = UI_DEFAULT_STATE, action) {

  let resourceId;
  let newState;
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

    case SET_PREVIEW_MODE:
      return {
        ...state,
        previewMode: action.previewMode
      };

    /**
     * CONTEXTUALIZATION RELATED
     */
    case UPDATE_CONTEXTUALIZATION:
    case CREATE_CONTEXTUALIZATION:
      const {
        contextualizationId,
        contextualization
      } = action;
      resourceId = contextualization.resourceId;
      const existingResources = state.editedComposition.resources;
      const newResources = existingResources.indexOf(resourceId) > -1 ?
                              existingResources : existingResources.concat(resourceId);

      return {
        ...state,
        editedComposition: {
          ...state.editedComposition,
          contextualizations: {
            ...state.editedComposition.contextualizations,
            [contextualizationId]: action.contextualization
          },
          resources: newResources
        }
      };
    case DELETE_CONTEXTUALIZATION:
      newState = {...state};
      const thatContextualization = newState.editedComposition.contextualizations[action.contextualizationId];
      // fetch resource reference
      resourceId = thatContextualization.resourceId;
      // verify that resource is not used by another contextualization
      const resourceIsUsed = Object.keys(newState.editedComposition.contextualizations)
                      .filter(id => id !== action.contextualizationId)
                      .find(thatContextualizationId => {
                        const cont = newState.editedComposition.contextualizations[thatContextualizationId];
                        return cont.resourceId === resourceId;
                      });
      // delete resource reference if not used by another contextualization
      if (!resourceIsUsed) {
        newState.editedComposition.resources = newState.editedComposition.resources.filter(id => id !== resourceId);
      }
      // fetch contextualizer reference
      const contextualizerId = thatContextualization.contextualizerId;
      // verify that contextualizer is not used by another contextualization
      const contextualizerIsUsed = Object.keys(newState.editedComposition.contextualizations)
                      .filter(id => id !== action.contextualizationId)
                      .find(thatContextualizationId => {
                        const cont = newState.editedComposition.contextualizations[thatContextualizationId];
                        return cont.contextualizerId === contextualizerId;
                      });
      // delete contextualizer if not used by another contextualization
      if (!contextualizerIsUsed) {
        delete newState.editedComposition.contextualizers[contextualizerId];
      }
      // delete contextualization reference
      delete newState.editedComposition.contextualizations[action.contextualizationId];
      return newState;

    case UPDATE_CONTEXTUALIZER:
    case CREATE_CONTEXTUALIZER:
      return {
        ...state,
        editedComposition: {
          ...state.editedComposition,
          contextualizers: {
            ...state.editedComposition.contextualizers,
            [action.contextualizerId]: action.contextualizer
          }
        }
      };


    default:
      return state;
  }
}

const DATA_DEFAULT_STATE = {
  compositions: [],
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

const EDITOR_DEFAULT_STATE = {
  editorStates: {},
  editorFocus: undefined
};

/**
 * This redux reducer handles the editor state management
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function editor(state = EDITOR_DEFAULT_STATE, action) {
  switch (action.type) {

    case UPDATE_DRAFT_EDITOR_STATE:
      return {
        ...state,
        editorStates: {
          ...state.editorStates,
          [action.id]: action.editorState
        }
      };
    case UPDATE_DRAFT_EDITORS_STATES:
      return {
        ...state,
        editorStates: action.editorsStates
      };
    case SET_EDITOR_FOCUS:
      return {
        ...state,
        editorFocus: action.editorFocus
      };

    default:
      return state;
  }
}

/**
 * asset requests are separated as they contain not serializable data
 */
const ASSET_REQUEST_DEFAULT_STATE = {

  /**
   * Id of the editor being prompted for asset (uuid of the composition or uuid of the note)
   */
  editorId: undefined,

  /**
   * selection state of the editor being prompted
   * @type {SelectionState}
   */
  selection: undefined,

  /**
   * Whether an asset is requested
   */
  assetRequested: false,

  /**
   * Interface type of assets to embed
   */
  assetEmbedType: 'resources',
};

/**
 * Handles the state change of asset request state
 * @param {object} state - the previous state
 * @param {object} action - the dispatched action
 * @return {object} state - the new state
 */
const assetRequeststate = (state = ASSET_REQUEST_DEFAULT_STATE, action) => {
  switch (action.type) {
    // an asset is prompted
    case PROMPT_ASSET_REQUEST:
      return {
        ...state,
        // in what editor is the asset prompted
        editorId: action.editorId,
        // where is the asset prompted in the editor
        selection: action.selection,
        // asset is prompted
        assetRequested: true,
      };
    // assets prompt is dismissed
    case UNPROMPT_ASSET_REQUEST:
      return {
        ...state,
        editorId: undefined,
        selection: undefined,
        assetRequested: false,
      };
    default:
      return state;
  }
};


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
  editor,
  assetRequeststate
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
const previewMode = state => state.ui.previewMode;

const compositions = state => state.data.compositions;
const editedComposition = state => state.ui.editedComposition;
const editedMetadata = state => state.ui.editedMetadata;

// editor related
const editorStates = state => state.editor.editorStates;
const editorFocus = state => state.editor.editorFocus;

// asset request related
const assetRequestState = state => state.assetRequeststate;
const assetRequested = state => state.assetRequested;

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

  // editor related
  editorStates,
  editorFocus,
  previewMode,

  assetRequestState,
  assetRequested,
});
