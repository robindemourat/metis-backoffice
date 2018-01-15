/**
 * This module exports a stateless component rendering the layout of the login view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';

import Login from '../../../components/Login/Login';


const LoginLayout = ({
  clientStatus,
  // clientOperation,

  token,
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
      <div>
        {clientStatus && (
          clientStatus === 'processing' || clientStatus === 'success' ?
            <article className="message is-info">
              <div className="message-header">
                <p>{t('connecting ...')}</p>
              </div>
            </article>
          :
            <article className="message is-danger">
              <div className="message-header">
                <p>{t('connexion failed')}</p>
              </div>
              <div className="message-body">
                {t('oups try again')}
              </div>
            </article>
        )}
      </div>
      {
        token && user ?
          <span>{t('you are authentified as {n}', {n: user && user.name})}</span>
          :
          <span>{t('you are not authentified')}</span>
      }
      {!user &&
      <p>
        <a className="button is-link" href="/forgot-password">{t('password forgotten')}</a>
      </p>
          }
    </section>
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
