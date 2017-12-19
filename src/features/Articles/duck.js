/**
 * This module exports logic-related elements for the articles feature
 * This module follows the ducks convention for putting in the same place actions, action types,
 * state selectors and reducers about a given feature (see https://github.com/erikras/ducks-modular-redux)
 * @module backoffice/features/Articles
 */

import {combineReducers} from 'redux';
import {createStructuredSelector} from 'reselect';
import {get, put, post, del} from '../../helpers/client';
import {createNewArticle} from '../../helpers/seeders';

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
export const GET_ARTICLES = 'GET_ARTICLES';
export const GET_ARTICLE = 'GET_ARTICLE';
export const CREATE_ARTICLE = 'CREATE_ARTICLE';
export const DELETE_ARTICLE = 'DELETE_ARTICLE';
export const UPDATE_ARTICLE = 'UPDATE_ARTICLE';

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
export const getArticlesList = () => ({
  type: GET_ARTICLES,
  promise: () =>
    get('articles')
});

export const getArticle = (id) => ({
  type: GET_ARTICLE,
  promise: () =>
    get('articles', {id})
});

export const createArticle = () => ({
  type: CREATE_ARTICLE,
  promise: () =>
    post('articles', createNewArticle())
});

export const updateArticle = (id, article) => ({
  type: UPDATE_ARTICLE,
  promise: () =>
    put('articles', {id}, article)
});

export const deleteArticle = (id) => ({
  type: DELETE_ARTICLE,
  promise: () =>
    del('articles', {id})
      .then(() => get('articles'))
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
 * Default/fallback state of the articles ui state
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

    case GET_ARTICLES:
    case CREATE_ARTICLE:
    case UPDATE_ARTICLE:
    case DELETE_ARTICLE:
      return {
        ...state,
        clientStatus: 'requesting',
        clientOperation: action.type,

      };

    case `${GET_ARTICLES}_SUCCESS`:
    case `${CREATE_ARTICLE}_SUCCESS`:
    case `${UPDATE_ARTICLE}_SUCCESS`:
    case `${DELETE_ARTICLE}_SUCCESS`:
      return {
        ...state,
        clientStatus: 'success',
      };

    case `${GET_ARTICLES}_FAIL`:
    case `${CREATE_ARTICLE}_FAIL`:
    case `${UPDATE_ARTICLE}_FAIL`:
    case `${DELETE_ARTICLE}_FAIL`:
      return {
        ...state,
        clientStatus: 'error',
      };

    case `${GET_ARTICLES}_RESET`:
    case `${CREATE_ARTICLE}_RESET`:
    case `${UPDATE_ARTICLE}_RESET`:
    case `${DELETE_ARTICLE}_RESET`:
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
  articles: []
};

/**
 * This redux reducer handles the ui state management (screen & modals opening)
 * @param {object} state - the state given to the reducer
 * @param {object} action - the action to use to produce new state
 * @return {object} newState - the resulting state
 */
function data(state = DATA_DEFAULT_STATE, action) {
  switch (action.type) {

    case `${CREATE_ARTICLE}_SUCCESS`:
      return {
        ...state,
        articles: state.articles.concat(action.result.data)
      };

    case `${DELETE_ARTICLE}_SUCCESS`:
      const deleted = action.result.data;
      return {
        ...state,
        articles: state.articles.filter(
                    article =>
                      deleted.find(
                        otherArticle =>
                          otherArticle._id === article._id
                        ) !== undefined
                  )
      };

    case `${GET_ARTICLE}_SUCCESS`:
      const a = action.result.data;
      return {
        ...state,
        articles: state.articles
                    .filter(article => article._id !== a._id)
                    .concat(a),
        editedArticle: a,
      };

    case `${GET_ARTICLES}_SUCCESS`:
      return {
        ...state,
        articles: action.result.data
      };

    case `${UPDATE_ARTICLE}_SUCCESS`:
      const newArticle = action.result.data;
      return {
        ...state,
        articles: state.articles.map(article => {
          if (article._id === newArticle._id) {
            return newArticle;
          }
          else {
            return article;
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
const articles = state => state.data.articles;
const editedArticle = state => state.data.editedArticle;

/**
 * The selector is a set of functions for accessing this feature's state
 * @type {object}
 */
export const selector = createStructuredSelector({
  articles,
  clientOperation,
  clientStatus,
  editedArticle,
});
