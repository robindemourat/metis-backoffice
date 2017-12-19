/**
 * This module exports a stateless component rendering the layout of the login view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';

import Login from '../../../components/Login/Login';


const LoginLayout = ({
  clientStatus,
  clientOperation,

  token,
  user,
  actions: {
    login
  }
}, {t}) => (
  <section>
    <h1>{t('authentication')}</h1>
    <Login onSubmit={login} />
    <p>{clientStatus} - {clientOperation}</p>
    {
      token && user ?
        <span>{t('you are authentified as {n}', {n: user && user.name})}</span>
        :
        <span>{t('you are not authentified')}</span>
    }
    {!user &&
    <p><a href="/forgot-password">{t('password forgotten')}</a></p>
        }
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
