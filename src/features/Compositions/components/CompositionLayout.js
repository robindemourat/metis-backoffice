/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the compositions view
 * @module plurishing-backoffice/features/Compositions
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import defaults from 'json-schema-defaults';

import './CompositionLayout.scss';

import ResourcesContainer from '../../Resources/components/ResourcesContainer';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const CompositionLayout = ({
  schema,
  compositions = [],

  clientStatus,
  clientOperation,

  editedComposition,
  editedMetadata,

  actions: {
    updateComposition,
    // promptNewCompositionForm,
    // unpromptNewCompositionForm,
    setEditedMetadata,
    unsetEditedMetadata,
  }
}, {t}) => {
  const onOpenMetadata = () => {
    setEditedMetadata(editedComposition.metadata);
  }
  return (
  <section className="plurishing-backoffice-Composition">
    <ResourcesContainer />
      {editedComposition ? 
      <section>
        <div className="header">
          <h1>
            {editedComposition.metadata.title}
          </h1>
          <ul>
            <li>
              <button onClick={onOpenMetadata}>{t('edit metadata')}</button>
            </li>
          </ul>
        </div>
      </section>
      : t('loading')
      }

    <Modal
      isOpen={editedMetadata !== undefined}
      onRequestClose={unsetEditedMetadata}
      contentLabel="Modal"
      ariaHideApp={false}
    >
      <SchemaForm
        title={t('edit composition')}
        schema={schema.properties.metadata}
        document={editedMetadata}
        onSubmit={metadata => {
          updateComposition(editedComposition._id, {
            ...editedComposition,
            metadata
          });
          unsetEditedMetadata();
        }}
        onCancel={unsetEditedMetadata}
      />
    </Modal>
  </section>
)};

/**
 * Context data used by the component
 */
CompositionLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default CompositionLayout;
