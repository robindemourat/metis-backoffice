/* eslint react/jsx-no-bind : 0 */
/* eslint no-alert : 0 */
/**
 * This module exports a stateless component rendering the layout of the montages view
 * @module plurishing-backoffice/features/Montages
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import defaults from 'json-schema-defaults';
import getConfig from '../../../helpers/getConfig';

import './MontagesLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const {apiBaseUri} = getConfig();

const MontagesLayout = ({
  schema,
  montages = [],

  newMontagePrompted,
  editedMontage,

  actions: {
    createMontage,
    deleteMontage,
    updateMontage,
    promptNewMontageForm,
    unpromptNewMontageForm,
    // setEditedMontage,
    unsetEditedMontage,
  }
}, {t}) => (
  <section className="plurishing-backoffice-Montages container is-fluid">
    <h1 className="title is-1">{t('Montages')}</h1>
    <ul className="section">
      <li>
        <button className="button is-primary is-fullwidth" onClick={promptNewMontageForm}>{t('new montage')}</button>
      </li>
      {
        montages.map((montage, index) => {
          const onDelete = () => {
            if (confirm(t('sure to delete montage ?'))) {
              deleteMontage(montage._id);
            }
          };
          /*const onPrompt = () => {
            setEditedMontage(montage);
          };*/
          return (
            <li
              key={index}
              className="box">
              <article className="media">
                <div className="media-left">
                  <span className="tag">
                    {montage.metadata.montage_type}
                  </span>
                </div>
                <div className="media-content">
                  <h2 className="title is-3">
                    <a href={`/montages/${montage._id}`}>
                      {montage.metadata.title || t('montage without title')}
                    </a>
                  </h2>
                  <div>
                    {/*<li>
                        <button className="button is-success" onClick={onPrompt}>{t('edit metadata')}</button>
                      </li>*/}
                    <a className="button is-success" href={`/montages/${montage._id}`}>{t('edit montage')}</a>
                    <a className="button is-link" href={`${apiBaseUri}montages/${montage._id}`} download>{t('download montage')}</a>
                    <button className="button is-danger" onClick={onDelete}>{t('delete montage')}</button>
                  </div>
                </div>
              </article>
            </li>
          );
        })
      }
    </ul>
    <Modal
      isOpen={newMontagePrompted}
      onRequestClose={unpromptNewMontageForm}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('new montage')}
        schema={schema.properties.metadata}
        document={undefined}
        onSubmit={metadata => {
          const montage = {
            ...defaults(schema),
            metadata
          };
          const subModel = schema.definitions[montage.metadata.montage_type];
          montage.data = defaults(subModel);
          createMontage(montage);
          unpromptNewMontageForm();
        }}
        onCancel={unpromptNewMontageForm} />
    </Modal>

    <Modal
      isOpen={editedMontage !== undefined}
      onRequestClose={unsetEditedMontage}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('edit montage')}
        schema={schema.properties.metadata}
        document={editedMontage && editedMontage.metadata}
        onSubmit={metadata => {
          updateMontage(editedMontage._id, {
            ...editedMontage,
            metadata
          });
          unsetEditedMontage();
        }}
        onCancel={unsetEditedMontage} />
    </Modal>
  </section>
);

/**
 * Context data used by the component
 */
MontagesLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default MontagesLayout;
