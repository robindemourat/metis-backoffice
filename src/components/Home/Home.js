/**
 * This module provides a representation of the application main page.
 * @module metis-backoffice/components/Home
 */

import React from 'react';
import PropTypes from 'prop-types';


const Home = (props, {t}) => (
  <section className="container is-fluid">
    <section className="section">
      <h1 className="title is-1">{t('Welcome to Metis')}</h1>
    </section>
    <section className="section">
      <p className="title is-4">
        {t('welcome text')}
      </p>
    </section>
  </section>
);

Home.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default Home;
