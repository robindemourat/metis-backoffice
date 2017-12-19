/**
 * Backoffice Application
 * =======================================
 * Combining the app's reducers
 * @module backoffice
 */
import {combineReducers} from 'redux';

import {i18nState} from 'redux-i18n';
import {routerReducer} from 'react-router-redux';

import articles from './../features/Articles/duck';
import assets from './../features/Assets/duck';

import users from './../features/Users/duck';
import auth from './../features/Auth/duck';

import {reducer as toastrReducer} from 'react-redux-toastr';


export default combineReducers({
  articles,
  assets,
  users,

  auth,
  i18nState,
  routing: routerReducer,
  toastr: toastrReducer,
});
