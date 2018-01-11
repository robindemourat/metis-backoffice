/**
 * Plurishing backoffice Application
 * =======================================
 * Combining the app's reducers
 * @module plurishing-backoffice
 */
import {combineReducers} from 'redux';

import {i18nState} from 'redux-i18n';
import {routerReducer} from 'react-router-redux';

import resources from './../features/Resources/duck';
import assets from './../features/Assets/duck';
import compositions from './../features/Compositions/duck';
import montages from './../features/Montages/duck';
import diffusions from './../features/Diffusions/duck';
import deliverables from './../features/Deliverables/duck';
import operations from './../features/Operations/duck';

import users from './../features/Users/duck';
import auth from './../features/Auth/duck';

import {reducer as toastrReducer} from 'react-redux-toastr';

export default combineReducers({
  resources,
  assets,
  compositions,
  montages,
  diffusions,
  deliverables,

  operations,

  users,

  auth,
  i18nState,
  routing: routerReducer,
  toastr: toastrReducer,
});
