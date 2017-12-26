/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the diffusions view
 * @module plurishing-backoffice/features/Diffusions
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import './DiffusionsLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const DiffusionsLayout = ({
  schema,
  diffusions = [],
  montageId,
  montageType,

  newDiffusionPrompted,
  editedDiffusion,

  onAfterChange,

  actions: {
    createDiffusion,
    // deleteDiffusion,
    updateDiffusion,
    promptNewDiffusionForm,
    unpromptNewDiffusionForm,
    setEditedDiffusion,
    unsetEditedDiffusion,
  }
}, {t}) => {
  const onPromptNewDiffusionForm = () => {
    promptNewDiffusionForm(montageId, montageType);
  };
  return (
    <section className="plurishing-backoffice-Diffusions">
      <ul>
        {
          diffusions.map((diffusion, index) => {
          /*const onDelete = () => deleteDiffusion(diffusion._id);*/
            const onPrompt = () => {
              setEditedDiffusion(diffusion);
            };
            return (
              <li
                key={index}>
                <ul>
                  <li>{t('diffusion of montage')} : {diffusion.montage_title}</li>
                  <li>{t('diffusion montage type')} : {diffusion.montage_type}</li>
                  <li>{t('status')} : {diffusion.status}</li>
                  {diffusion.date_started && <li>{t('diffusion date')} {diffusion.date_started}</li>}
                  {/*<li><button onClick={onDelete}>{t('delete diffusion')}</button></li>*/}
                  <li><button onClick={onPrompt}>{t('edit diffusion')}</button></li>
                </ul>
              </li>
            );
          })
        }
        <li>
          <button onClick={onPromptNewDiffusionForm}>{t('new diffusion')}</button>
        </li>
      </ul>
      <Modal
        isOpen={newDiffusionPrompted}
        onRequestClose={unpromptNewDiffusionForm}
        contentLabel="Modal"
        ariaHideApp={false}>
        <SchemaForm
          title={t('new diffusion')}
          schema={schema}
          document={editedDiffusion}
          onAfterChange={onAfterChange}
          onSubmit={diffusion => {
            createDiffusion(diffusion);
            unpromptNewDiffusionForm();
          }}
          onCancel={unpromptNewDiffusionForm} />
      </Modal>

      <Modal
        isOpen={editedDiffusion !== undefined && !newDiffusionPrompted}
        onRequestClose={unsetEditedDiffusion}
        contentLabel="Modal"
        ariaHideApp={false}>
        <SchemaForm
          title={t('edit diffusion')}
          schema={schema}
          document={editedDiffusion}
          onAfterChange={onAfterChange}
          onSubmit={() => {
            updateDiffusion(editedDiffusion._id, editedDiffusion);
            unsetEditedDiffusion();
          }}
          onCancel={unsetEditedDiffusion} />
      </Modal>
    </section>
  );
};

/**
 * Context data used by the component
 */
DiffusionsLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default DiffusionsLayout;
