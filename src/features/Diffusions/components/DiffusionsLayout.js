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
        nextProps.getDiffusion(nextProps.diffusion._id)
          .then(() => nextProps.getDeliverables());
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
        deliverables = [],
        onPrompt,
        deliverableURLPrefix,
      }
    } = this;
    let statusClass;
    switch (diffusion.status) {
      case 'success':
        statusClass = 'is-success';
        break;
      case 'processing':
        statusClass = 'is-info';
        break;
      default:
        statusClass = 'is-danger';
        break;
    }
    return (
      <li className="box">
        <article className="media">
          <div className="media-left">
            <span className="tag">
              {t(diffusion.montage_type)}
            </span>
            {/*<figure className="image is-64x64">
              <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
            </figure>*/}
          </div>
          <div className="media-content">
            <ul>
              <li className="title is-4">{diffusion.montage_title}</li>
              <li>{t('status')} : <span className={`tag ${statusClass}`}>{t(diffusion.status)}</span></li>
              {
                diffusion.version && diffusion.version.length ?
                  <li>
                    <p>{t('version')} : <span className="tag">{diffusion.version}</span> </p>
                  </li>
                : null
              }
              <li>
                <span>{t('targets')}</span> : {
                  diffusion.parameters.targets.map(target => (
                    <span key={target} className="tag">{t(target)}</span>
                  ))
                }
              </li>
              {deliverables.length ?
                <li>
                  <span>{t('attached deliverables')}</span> : {
                    deliverables.map(deliverable => (
                      <a
                        className="button is-link"
                        href={`${deliverableURLPrefix}${deliverable._id}/${deliverable.filename}`}
                        target="blank"
                        key={deliverable._id}>
                        {deliverable.mimetype.split('/').pop()}
                      </a>
                    ))
                  }
                </li> : null
              }
              {diffusion.date_started && <li><span>{t('date')}</span> : <span className="tag">{new Date(diffusion.date_started).toLocaleString()}</span></li>}
              {/*<li><button onClick={onDelete}>{t('delete diffusion')}</button></li>*/}
              <li><button className="button is-primary" onClick={onPrompt}>{t('edit diffusion')}</button></li>
            </ul>
          </div>
        </article>
      </li>
    );
  }
}

const DiffusionsLayout = ({
  schema,
  diffusions = [],
  deliverables = [],
  montageId,
  montageType,

  newDiffusionPrompted,
  editedDiffusion,

  onAfterChange,

  actions: {
    getDiffusion,
    // deleteDiffusion,
    updateDiffusion,
    promptNewDiffusionForm,
    unpromptNewDiffusionForm,
    setEditedDiffusion,
    unsetEditedDiffusion,
    getDeliverables,
  },
  createDiffusion,
  deliverableURLPrefix
}, {t}) => {
  const onPromptNewDiffusionForm = () => {
    promptNewDiffusionForm(montageId, montageType);
  };
  return (
    <section className="plurishing-backoffice-Diffusions container is-fluid">
      <section className="section  section-title">
        <h1 className="title is-1">{t('Diffusions')}</h1>
      </section>
      <ul className="section">
        <li className="section">
          <button className="button is-primary is-fullwidth" onClick={onPromptNewDiffusionForm}>{t('new diffusion')}</button>
        </li>
        {
          diffusions.reverse().map((diffusion, index) => {
          /*const onDelete = () => deleteDiffusion(diffusion._id);*/
            const onPrompt = () => {
              setEditedDiffusion(diffusion);
            };
            const targetDeliverables = deliverables.filter(deliverable => deliverable.diffusion_id === diffusion._id);
            return (
              <DiffusionCartel
                key={index}
                diffusion={diffusion}
                deliverables={targetDeliverables}
                deliverableURLPrefix={deliverableURLPrefix}
                onPrompt={onPrompt}
                getDiffusion={getDiffusion}
                getDeliverables={getDeliverables} />
            );
          })
        }
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
