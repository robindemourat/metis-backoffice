/**
 * Backoffice Application
 * =======================================
 * Home view component
 * @module backoffice
 */

import React from 'react';
import PropTypes from 'prop-types';


const Home = (props, {t}) => (
  <section className="container is-fluid">
    <h1 className="title is-1">{t('Welcome to Metis')}</h1>
    <p>
      {t('welcome text')}
    </p>
  </section>
);

Home.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Home;
