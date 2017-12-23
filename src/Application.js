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

import Resources from './features/Resources/components/ResourcesContainer.js';

import Assets from './features/Assets/components/AssetsContainer.js';

import Compositions from './features/Compositions/components/CompositionsContainer.js';
import Composition from './features/Compositions/components/CompositionContainer.js';

import Montages from './features/Montages/components/MontagesContainer.js';
import Montage from './features/Montages/components/MontageContainer.js';

import Deliverables from './features/Deliverables/components/DeliverablesContainer.js';

import Diffusions from './features/Diffusions/components/DiffusionsContainer.js';

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

      <Route path="/resources" component={Resources} />

      <Route path="/assets" component={Assets} />

      <Route path="/deliverables" component={Deliverables} />

      <Route path="/compositions" component={Compositions} />
      <Route path="/compositions/:id" component={Composition} />

      <Route path="/montages" component={Montages} />
      <Route path="/montages/:id" component={Montage} />

      <Route path="/diffusions" component={Diffusions} />


      <Route path="/users" component={userIsAdmin(Users)} />
      <Route path="/users/:id" component={User} />
      <Route path="/new-user" component={userIsAdmin(NewUser)} />

      <Route path="/change-password" component={ChangePassword} />
    </Route>

    <Route path="/forgot-password" component={ForgotPassword} />
  </Router>
);

export default Application;
