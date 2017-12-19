/**
 * Backoffice Application
 * =======================================
 * Root component of the application.
 * @module backoffice
 */
import React from 'react';

import {Router, Route, IndexRoute} from 'react-router';

import './core.scss';
import './Application.scss';


import Layout from './features/Layout/components/LayoutContainer.js';

import Articles from './features/Articles/components/ArticlesContainer.js';
import Article from './features/Articles/components/ArticleContainer.js';

import Assets from './features/Assets/components/AssetsContainer.js';

import Users from './features/Users/components/UsersContainer.js';
import User from './features/Users/components/UserContainer.js';
import NewUser from './features/Users/components/NewUserContainer.js';

import Login from './features/Auth/components/LoginContainer.js';
import ChangePassword from './features/Auth/components/ChangePasswordContainer.js';
import ForgotPassword from './features/Auth/components/ForgotPasswordContainer.js';
import UserSetup from './features/Auth/components/UserSetupContainer.js';
import Home from './components/Home/Home.js';

import {userIsAuthenticated, userIsAdmin, userIsNotAuthenticated} from './auth';

/**
 * Renders the whole backoffice application
 * @return {ReactComponent} component
 */
const Application = ({history}) => (
  <Router history={history}>
    <Route path="/login" component={userIsNotAuthenticated(Login)} />

    <Route path="/signup/:id/:token" component={UserSetup} />
    <Route path="/reset-password/:id/:token" component={UserSetup} />

    <Route path="/" component={userIsAuthenticated(Layout)}>
      {<IndexRoute path="" component={Home} />}

      <Route path="/articles" component={Articles} />
      <Route path="/articles/:id" component={Article} />

      <Route path="/assets" component={Assets} />

      <Route path="/users" component={userIsAdmin(Users)} />
      <Route path="/users/:id" component={User} />
      <Route path="/new-user" component={userIsAdmin(NewUser)} />

      <Route path="/change-password" component={ChangePassword} />
    </Route>

    <Route path="/forgot-password" component={ForgotPassword} />
  </Router>
);

export default Application;
