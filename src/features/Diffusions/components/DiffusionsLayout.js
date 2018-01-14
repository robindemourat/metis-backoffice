/* eslint react/jsx-no-bind : 0 */
/* eslint react/no-set-state : 0 */
/**
 * This module exports a stateless component rendering the layout of the diffusions view
 * @module plurishing-backoffice/features/Diffusions
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import './DiffusionsLayout.scss';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

class DiffusionCartel extends Component {
  static contextTypes = {
    t: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isWaiting: false
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.diffusion && nextProps.diffusion.status === 'processing' && !this.state.isWaiting) {
      this.setState({isWaiting: true});
      setTimeout(() => {
        nextProps.getDiffusion(nextProps.diffusion._id);
        this.setState({isWaiting: false});
      }, 1000);
    }
  }
  render() {
    const {
      context: {
        t
      },
      props: {
        diffusion,
        onPrompt
      }
    } = this;
    return (
      <li>
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
  }
}

const DiffusionsLayout = ({
  schema,
  diffusions = [],
  montageId,
  montageType,

  newDiffusionPrompted,
  editedDiffusion,

  onAfterChange,

  actions: {
    getDiffusion,
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
              <DiffusionCartel
                key={index}
                diffusion={diffusion}
                onPrompt={onPrompt}
                getDiffusion={getDiffusion} />
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
