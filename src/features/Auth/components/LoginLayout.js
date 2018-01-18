/**
 * This module exports a stateless component rendering the layout of the login view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';

import Login from '../../../components/Login/Login';

import ReduxToastr from 'react-redux-toastr';

const LoginLayout = ({
  // clientStatus,
  // clientOperation,

  user,
  actions: {
    login
  }
}, {t}) => (
  <section className="container is-fluid">
    <section className="section">
      <h1 className="title is-1">{t('Welcome to Metis - login')}</h1>
    </section>
    <section className="section">
      <Login onSubmit={login} />
      {!user &&
      <p className="section">
        <a className="button is-link" href="/forgot-password">{t('password forgotten')}</a>
      </p>
          }
    </section>
    <ReduxToastr
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      timeOut={1000} />
  </section>
);

/**
 * Context data used by the component
 */
LoginLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default LoginLayout;
