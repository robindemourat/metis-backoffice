/**
 * This module provides a reusable bibliography wrapper for the editor component
 * @module metis-backoffice/components/SectionEditor
 */

import React from 'react';
import PropTypes from 'prop-types';


/**
 * Renders the Bib component as a pure function
 * @param {object} props - (un)used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
const Bib = (unusedProps, {
  bibliography,
  t
}) => {
  return (
    <section className="editor-bibliography">
      <h2>{t('references-title')}</h2>
      <div>{bibliography}</div>
    </section>
  );
};

/**
 * Component's properties types
 */
Bib.propTypes = {};


/**
 * Component's context used properties
 */
Bib.contextTypes = {

  /**
   * The properly formatted bibliography object to be rendered
   */
  bibliography: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The active language
   */
  lang: PropTypes.string,

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default Bib;
