/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module backoffice/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';

import './LayoutLayout.scss';


const LoginLayout = ({
  user,
  children,
  actions: {
    logout
  }
}, {t}) => (
  <div className="plurishing-backoffice-Layout">
    <nav>
      <h1>Plurishing</h1>
      <ul>
        <li>
          <a href="/">{t('home')}</a>
        </li>
        <li>
          <a href="/assets">{t('assets')}</a>
        </li>
        <li>
          <a href="/resources">{t('resources')}</a>
        </li>
        <li>
          <a href="/compositions">{t('compositions')}</a>
        </li>
        {user && user.admin && <li>
          <a href="/users">{t('users')}</a>
        </li>}
        <li>
          <a href={`/users/${user._id}`}>{t('my profile')}</a>
        </li>
      </ul>

      {user &&
      <ul>
        <li>
          {t('connected as {n}', {n: user.name})}
        </li>
        <li>
          <a onClick={logout} href="/">{t('disconnect')}</a>
        </li>
      </ul>
      }
    </nav>
    <section>
      {children}
    </section>

    <ReduxToastr
      transitionIn="fadeIn"
      transitionOut="fadeOut"
      timeOut={1000} />
  </div>
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
