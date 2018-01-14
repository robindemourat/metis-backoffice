/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the montages view
 * @module plurishing-backoffice/features/Montages
 */
import React from 'react';
import PropTypes from 'prop-types';

import './MontageLayout.scss';

import DiffusionsContainer from '../../Diffusions/components/DiffusionsContainer';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

import MontagePreview from '../../../components/MontagePreview/MontagePreview';


import citationStyle from 'raw-loader!../assets/apa.csl';
import citationLocale from 'raw-loader!../assets/english-locale.xml';

const MontageLayout = ({
  schema,
  editedMontage,

  assets,
  resources,
  compositions,

  actions: {
    updateMontage,
  },
  getAssetUri
}, {t}) => {

  const onUpdateMontage = montage => {
    updateMontage(montage._id, montage);
  };

  return (
    <section className="plurishing-backoffice-Montage columns">
      <div className="column">
        <h2 className="title is-3">{t('montage edition')}</h2>
        <div className="column-content">
          {editedMontage ?
            <section className="montage-editor-wrapper">
              <div className="body">
                <SchemaForm
                  schema={schema}
                  document={editedMontage}
                  onSubmit={onUpdateMontage} />
              </div>
            </section>
          : t('loading')
          }
        </div>
      </div>
      {editedMontage ?
        <div className="column">
          <h2 className="title is-3">{t('montage preview')}</h2>
          <div className="column-content">
            <MontagePreview
              getAssetUri={getAssetUri}
              montage={editedMontage}
              assets={assets}
              resources={resources}
              compositions={compositions}
              citationStyle={citationStyle}
              citationLocale={citationLocale} />
          </div>
        </div> : null}
      <div className="column aside-picker">
        <h2 className="title is-3">{t('related diffusions')}</h2>
        <div className="column-content">
          <DiffusionsContainer
            montageId={editedMontage && editedMontage._id}
            montageType={editedMontage && editedMontage.metadata.montage_type} />
        </div>
      </div>
    </section>
);
};

/**
 * Context data used by the component
 */
MontageLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default MontageLayout;
