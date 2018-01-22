/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module metis-backoffice/features/Layout
 */
import React from 'react';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';

import './LayoutLayout.scss';

const RouteItem = ({
  label,
  path,
  active
}) => (
  <li>
    <a className={`button is-link is-fullwidth ${active ? 'is-active' : ''}`} href={path}>{label}</a>
  </li>
);

const LoginLayout = ({
  user,
  children,

  navOpen,
  toggleNav,

  actions: {
    logout
  },
  location: {
    pathname
  }
}, {t}) => (
  <div className="metis-backoffice-Layout">
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand is-flex-desktop">
        <h1 className="title is-flex-desktop">
          <a className="button is-primary" href="/">
            Metis
          </a>
        </h1>
        <button className="button navbar-burger" onClick={toggleNav}>
          <span />
          <span />
          <span />
        </button>
      </div>
      <div className={`navbar-menu ${navOpen ? 'is-active' : ''}`}>
        <ul className="navbar-start">
          {
            [{
              path: '/assets',
              label: t('assets')
            },
            {
              path: '/resources',
              label: t('resources')
            },
            {
              path: '/compositions',
              label: t('compositions')
            },
            {
              path: '/montages',
              label: t('montages')
            },
            {
              path: '/diffusions',
              label: t('diffusions')
            },
            {
              path: '/deliverables',
              label: t('deliverables')
            },
            {
              path: '/operations',
              label: t('operations')
            },
            {
              path: '/users',
              label: t('users'),
              condition: user && user.admin === true
            }/*,
            {
              path: `/users/${user._id}`,
              label: t('my profile')
            }*/
            ]
            .filter(route => route.condition === undefined || route.condition === true)
            .map(({path, label}) => (
              <RouteItem
                key={path}
                path={path}
                label={label}
                active={pathname.indexOf(path) === 0} />
            ))
          }
        </ul>

        {user &&
        <ul className="navbar-end">
          <li>
            <a href={`/users/${user._id}`} className="button is-info is-fullwidth">
              {t('connected as {n}', {n: user.name})}
            </a>
          </li>
          <li>
            <a onClick={logout} className="button is-warning is-fullwidth" href="/">{t('disconnect')}</a>
          </li>
        </ul>
        }
      </div>
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
