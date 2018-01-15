/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the resources view
 * @module plurishing-backoffice/features/Resources
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import './ResourcesLayout.scss';

import ResourceDrop from '../../../components/ResourceDrop/ResourceDrop';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';

const ResourcesLayout = ({
  schema,
  resources = [],

  newResourcePrompted,
  editedResource,

  actions: {
    createResource,
    deleteResource,
    updateResource,
    promptNewResourceForm,
    unpromptNewResourceForm,
    setEditedResource,
    unsetEditedResource,
  },
  createResources
}, {t}) => (
  <section className="plurishing-backoffice-Resources container is-fluid">
    <section className="section section-title">
      <h1 className="title is-1">{t('Resources')}</h1>
    </section>
    <ul className="section">
      <li className="section">
        <button className="button is-primary is-fullwidth" onClick={promptNewResourceForm}>{t('new resource')}</button>
      </li>
      {
        resources.map((resource, index) => {
          const onDelete = () => deleteResource(resource._id);
          const onPrompt = () => {
            setEditedResource(resource);
          };
          return (
            <li
              className="box"
              key={index}>
              <article className="media">
                <div className="media-left">
                  <span className="tag">
                    {t(resource.metadata.resource_type)}
                  </span>
                  {/*<figure className="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
                  </figure>*/}
                </div>
                <div className="media-content">
                  <h4 className="title is-4" onClick={onPrompt}>{resource.metadata.name || t('resource without name')}</h4>
                  <div>
                    <button className="button is-success" onClick={onPrompt}>
                      {t('edit resource')}
                    </button>
                    <button className="button is-danger" onClick={onDelete}>
                      {t('delete resource')}
                    </button>
                  </div>
                </div>
              </article>
            </li>
          );
        })
      }
      <li className="box">
        <article className="media">
          <div className="media-content">
            <h4 className="title is-4">{t('Add resources from bibtex file')}</h4>
            <ResourceDrop
              title={t('drop .bib file here to add bibliographical resources')}
              onDrop={createResources} />
          </div>
        </article>
      </li>
    </ul>
    <Modal
      isOpen={newResourcePrompted}
      onRequestClose={unpromptNewResourceForm}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('new resource')}
        schema={schema}
        document={undefined}
        onSubmit={resource => {
          createResource(resource);
          unpromptNewResourceForm();
        }}
        onCancel={unpromptNewResourceForm} />
    </Modal>

    <Modal
      isOpen={editedResource !== undefined}
      onRequestClose={unsetEditedResource}
      contentLabel="Modal"
      ariaHideApp={false}>
      <SchemaForm
        title={t('edit resource')}
        schema={schema}
        document={editedResource}
        onSubmit={resource => {
          updateResource(resource._id, resource);
          unsetEditedResource();
        }}
        onCancel={unsetEditedResource} />
    </Modal>
  </section>
);

/**
 * Context data used by the component
 */
ResourcesLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ResourcesLayout;
