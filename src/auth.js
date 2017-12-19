/**
 * Backoffice Application
 * =======================================
 * Auth-related routes middlewares
 * @module backoffice
 */
import locationHelperBuilder from 'redux-auth-wrapper/history3/locationHelper';
import {connectedRouterRedirect} from 'redux-auth-wrapper/history3/redirect';
import {routerActions} from 'react-router-redux';

import {selector} from './features/Auth/duck';

import Loading from './components/Loading/Loading';

const locationHelper = locationHelperBuilder({});

export const userIsAuthenticated = connectedRouterRedirect({
  authenticatedSelector: state => selector(state.auth).user !== undefined,
  authenticatingSelector: state => selector(state.auth).isLoading,
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/login',
  AuthenticatingComponent: Loading,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAuthenticated'
});

export const userIsAdmin = connectedRouterRedirect({
  redirectPath: '/',
  allowRedirectBack: false,
  authenticatedSelector: state => selector(state.auth).user !== undefined && selector(state.auth).user.admin,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsAdmin',
});

export const userIsNotAuthenticated = connectedRouterRedirect({
  redirectPath: (state, ownProps) => locationHelper.getRedirectQueryParam(ownProps) || '/',
  allowRedirectBack: false,
  // Want to redirect the user when they are done loading and authenticated
  authenticatedSelector: state => selector(state.auth).user === undefined && selector(state.auth).isLoading === false,
  redirectAction: routerActions.replace,
  wrapperDisplayName: 'UserIsNotAuthenticated'
});
