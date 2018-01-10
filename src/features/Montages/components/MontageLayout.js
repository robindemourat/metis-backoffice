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

const MontageLayout = ({
  schema,
  editedMontage,
  actions: {
    updateMontage,
  },
  getAssetUri
}, {t}) => {

  const onUpdateMontage = montage => {
    updateMontage(montage._id, montage);
  };

  return (
    <section className="plurishing-backoffice-Montage">
      <div>
        <h2>{t('montage edition')}</h2>
        {editedMontage ?
          <section className="montage-editor-wrapper">
            <div className="header">
              <h1>
                {editedMontage.metadata.title}
              </h1>
            </div>
            <div className="body">
              <SchemaForm
                title={t('edit montage')}
                schema={schema}
                document={editedMontage}
                onSubmit={onUpdateMontage} />
            </div>
          </section>
      : t('loading')
      }
      </div>
      {editedMontage ? <div>
        <h2>{t('montage preview')}</h2>
        <MontagePreview getAssetUri={getAssetUri} montage={editedMontage} />
      </div> : null}
      <div>
        <h2>{t('related diffusions')}</h2>
        <DiffusionsContainer
          montageId={editedMontage && editedMontage._id}
          montageType={editedMontage && editedMontage.metadata.montage_type} />
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
