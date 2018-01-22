/* eslint react/jsx-no-bind : 0 */
/* eslint no-alert : 0 */
/**
 * This module exports a stateless component rendering the layout of the compositions view
 * @module metis-backoffice/features/Compositions
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import defaults from 'json-schema-defaults';
import getConfig from '../../../helpers/getConfig';

import './CompositionsLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const {apiBaseUri} = getConfig();

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
    // setEditedComposition,
    unsetEditedComposition,
  }
}, {t}) => (
  <section className="metis-backoffice-Compositions container is-fluid">
    <section className="section">
      <h1 className="title is-1">{t('Compositions')}</h1>
    </section>
    <ul className="section">
      <li className="section">
        <button className="button is-primary is-fullwidth" onClick={promptNewCompositionForm}>{t('new composition')}</button>
      </li>
      {
        compositions.map((composition, index) => {
          const onDelete = () => {
            if (confirm(t('sure to delete composition ?'))) {
              deleteComposition(composition._id);
            }
          };
          // const onUpdate = newComposition => updateComposition(composition._id, newComposition);
          /*const onPrompt = () => {
            setEditedComposition(composition);
          };*/
          return (
            <li
              key={index}
              className="box">
              <article className="media">

                <div className="media-content">
                  <h3 className="title is-4">
                    <a href={`/compositions/${composition._id}`}>
                      {composition.metadata.title || t('composition without title')}
                    </a>
                  </h3>
                  <div>
                    <a className="button is-success" href={`/compositions/${composition._id}`}>{t('edit composition')}</a>
                    <a className="button is-link" href={`${apiBaseUri}compositions/${composition._id}`} download>{t('download composition')}</a>
                    {/*<button className="button is-success" onClick={onPrompt}>{t('edit metadata')}</button>*/}
                    <button className="button is-danger" onClick={onDelete}>
                      {t('delete composition')}
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })
      }
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
