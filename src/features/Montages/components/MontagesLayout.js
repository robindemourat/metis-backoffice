/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the montages view
 * @module plurishing-backoffice/features/Montages
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';
import defaults from 'json-schema-defaults';

import './MontagesLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

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
    setEditedMontage,
    unsetEditedMontage,
  }
}, {t}) => (
  <section className="plurishing-backoffice-Montages">
    <ul>
      {
        montages.map((montage, index) => {
          const onDelete = () => {
            if (confirm(t('sure to delete montage ?'))) {/* eslint no-alert : 0 */
              deleteMontage(montage._id);
            }
          };
          const onPrompt = () => {
            setEditedMontage(montage);
          };
          return (
            <li
              key={index}>
              <h2>
                <a href={`/montages/${montage._id}`}>
                  {montage.metadata.title || t('montage without title')}
                </a>
              </h2>
              <ul>
                <li>
                  {t('montage type')}: {montage.metadata.montage_type}
                </li>
                <li>
                  <button onClick={onDelete}>{t('delete montage')}</button>
                </li>
                <li>
                  <button onClick={onPrompt}>{t('edit metadata')}</button>
                </li>
                <li>
                  <a href={`/montages/${montage._id}`}>{t('edit montage')}</a>
                </li>
              </ul>
            </li>
          );
        })
      }
      <li>
        <button onClick={promptNewMontageForm}>{t('new montage')}</button>
      </li>
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
