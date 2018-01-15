/**
 * Application Endpoint
 * ======================================
 *
 * Rendering the application.
 * @module backoffice
 */
import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import I18n from 'redux-i18n';

import {browserHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';


import configureStore from './redux/configureStore';
import Application from './Application';

import translations from './translations/index.js';


let CurrentApplication = Application;

const initialState = {};

const store = configureStore(initialState);
window.store = store;


// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);


const mountNode = document.getElementById('mount');

/**
 * Mounts the application to the given mount node
 */
export function renderApplication() {
  const group = (
    <Provider store={store}>
      <I18n translations={translations} initialLang={'fr'}>
        <CurrentApplication history={history} />
      </I18n>
    </Provider>
  );
  render(group, mountNode);
}

renderApplication();

/**
 * Hot-reloading.
 */
if (module.hot) {
  module.hot.accept('./Application', function() {
    CurrentApplication = require('./Application').default;
    renderApplication();
  });
}
