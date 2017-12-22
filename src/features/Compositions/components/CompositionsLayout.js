/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the compositions view
 * @module plurishing-backoffice/features/Compositions
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import defaults from 'json-schema-defaults';

import './CompositionsLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const CompositionsLayout = ({
  schema,
  compositions = [],

  newCompositionPrompted,
  editedComposition,

  actions: {
    createComposition,
    deleteComposition,
    updateComposition,
    promptNewCompositionForm,
    unpromptNewCompositionForm,
    setEditedComposition,
    unsetEditedComposition,
  }
}, {t}) => (
  <section className="plurishing-backoffice-Compositions">
    <ul>
      {
        compositions.map((composition, index) => {
          const onDelete = () => {
            if (confirm(t('sure to delete composition'))) {
              deleteComposition(composition._id)
            }
          };
          // const onUpdate = newComposition => updateComposition(composition._id, newComposition);
          const onPrompt = () => {
            setEditedComposition(composition);
          };
          return (
            <li
              key={index}>
              <h3>
                <a href={`/compositions/${composition._id}`}>
                  {composition.metadata.title || t('composition without title')}
                </a>
              </h3>
              <button onClick={onDelete}>{t('delete composition')}</button>
              <button onClick={onPrompt}>{t('edit metadata')}</button>
              <a href={`/compositions/${composition._id}`}>{t('edit composition')}</a>
            </li>
          );
        })
      }
      <li>
        <button onClick={promptNewCompositionForm}>{t('new composition')}</button>
      </li>
    </ul>
    <Modal
      isOpen={newCompositionPrompted}
      onRequestClose={unpromptNewCompositionForm}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('new composition')}
        schema={schema.properties.metadata}
        document={undefined}
        onSubmit={metadata => {
          const composition = {
            ...defaults(schema),
            metadata
          };
          createComposition(composition);
          unpromptNewCompositionForm();
        }}
        onCancel={unpromptNewCompositionForm} />
    </Modal>

    <Modal
      isOpen={editedComposition !== undefined}
      onRequestClose={unsetEditedComposition}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('edit composition')}
        schema={schema.properties.metadata}
        document={editedComposition && editedComposition.metadata}
        onSubmit={metadata => {
          updateComposition(editedComposition._id, {
            ...editedComposition,
            metadata
          });
          unsetEditedComposition();
        }}
        onCancel={unsetEditedComposition} />
    </Modal>
  </section>
);

/**
 * Context data used by the component
 */
CompositionsLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default CompositionsLayout;
