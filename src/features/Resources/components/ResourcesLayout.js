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
  <section className="plurishing-backoffice-Resources">
    <ul>
      {
        resources.map((resource, index) => {
          const onDelete = () => deleteResource(resource._id);
          const onPrompt = () => {
            setEditedResource(resource);
          };
          return (
            <li
              key={index}>
              <button onClick={onPrompt}>{resource.metadata.name || t('resource without name')}</button>
              <button onClick={onDelete}>{t('delete resource')}</button>
              <button onClick={onPrompt}>{t('edit resource')}</button>
            </li>
          );
        })
      }
      <li>
        <button onClick={promptNewResourceForm}>{t('new resource')}</button>
      </li>
      <li>
        <ResourceDrop
          title={t('drop .bib file here to add bibliographical resources')}
          onDrop={createResources} />
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
