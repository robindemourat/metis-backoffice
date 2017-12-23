/**
 * This module exports a stateless component rendering the layout of the layout view
 * @module backoffice/features/Layout
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
    <a href={path}>{label} {active ? ' - active' : ''}</a>
  </li>
);

const LoginLayout = ({
  user,
  children,
  actions: {
    logout
  },
  location: {
    pathname
  }
}, {t}) => (
  <div className="plurishing-backoffice-Layout">
    <nav>
      <h1><a href="/">Plurishing</a></h1>
      <ul>
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
            path: '/users',
            label: t('users'),
            condition: user && user.admin === true
          },
          {
            path: `/users/${user._id}`,
            label: t('my profile')
          }
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
