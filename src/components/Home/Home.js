/**
 * Backoffice Application
 * =======================================
 * Home view component
 * @module backoffice
 */

import React from 'react';
import PropTypes from 'prop-types';


const Home = (props, {t}) => (
  <section>
    <h1>{t('Welcome to the home')}</h1>
    <p>
      {t('welcome text')}
    </p>
  </section>
);

Home.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Home;
