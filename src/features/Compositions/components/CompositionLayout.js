/* eslint react/jsx-no-bind : 0 */
/* eslint no-console : 0 */
/**
 * This module exports a stateless component rendering the layout of the compositions view
 * @module plurishing-backoffice/features/Compositions
 */
import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-modal';

import './CompositionLayout.scss';

import ResourcesContainer from '../../Resources/components/ResourcesContainer';

import SchemaForm from '../../../components/SchemaForm/SchemaForm';
import CompositionEditor from '../../../components/CompositionEditor/CompositionEditor';

const CompositionLayout = ({
  schema,
  resources = [],

  editedComposition,
  editedMetadata,

  editorStates,
  editorFocus,

  previewMode,

  assetRequestState,

  actions: {
    updateComposition,
    // promptNewCompositionForm,
    // unpromptNewCompositionForm,
    setEditedMetadata,
    unsetEditedMetadata,

    updateDraftEditorState,
    updateDraftEditorsStates,

    setEditorFocus,
    setPreviewMode,

    promptAssetRequest,
    unpromptAssetRequest,
  }
}, {t}) => {
  const onOpenMetadata = () => {
    setEditedMetadata(editedComposition.metadata);
  };
  const resourcesMap = resources.reduce((res, resource) => ({
    ...res,
    [resource._id]: resource
  }), {});

  const onUpdateComposition = composition => {
    updateComposition(composition._id, composition);
  };

  return (
    <section className="plurishing-backoffice-Composition">
      <ResourcesContainer />
      {editedComposition ?
        <section className="composition-editor-wrapper">
          <div className="header">
            <h1>
              <button onClick={onOpenMetadata}>{editedComposition.metadata.title}</button>
            </h1>
            <ul>
              <li>
                <button onClick={onOpenMetadata}>{t('edit metadata')}</button>
              </li>
            </ul>
            <ul>
              {
                [
                  {
                    id: 'web',
                    label: t('web')
                  },
                  {
                    id: 'pdf',
                    label: t('pdf')
                  },
                  {
                    id: 'epub-fixed',
                    label: t('epub-fixed')
                  },
                  {
                    id: 'epub-reflowable',
                    label: t('epub-reflowable')
                  }
                ]
                .map(option => {
                  const active = option.id === previewMode;
                  const onClick = () => {
                    setPreviewMode(option.id);
                  };
                  return (
                    <li key={option.id}>
                      <button onClick={onClick}>
                        {option.label}{active ? ' - active' : ''}
                      </button>
                    </li>
                  );
                })
              }
            </ul>
          </div>
          <div className="body">
            <CompositionEditor
              resources={resourcesMap}
              composition={editedComposition}

              updateComposition={onUpdateComposition}
              editorStates={editorStates}

              renderingMode={previewMode}

              updateDraftEditorState={updateDraftEditorState}
              updateDraftEditorsStates={updateDraftEditorsStates}
              editorFocus={editorFocus}

              summonAsset={e => console.log('summon asset', e)}

              createContextualization={e => console.log('create contextualization', e)}
              createContextualizer={e => console.log('create contextualizer', e)}
              createResource={e => console.log('create resource', e)}

              updateContextualizer={e => console.log('update contextualizer', e)}
              updateResource={e => console.log('update resource', e)}
              updateContextualization={e => console.log('update contextualization', e)}

              deleteContextualization={e => console.log('delete contextualization', e)}
              deleteContextualizer={e => console.log('delete contextualizer', e)}

              requestAsset={promptAssetRequest}
              cancelAssetRequest={unpromptAssetRequest}
              assetRequestState={assetRequestState}
              assetRequestPosition={assetRequestState.selection}
              assetEmbedType={'resources'}

              openResourceConfiguration={e => console.log('open resource configuration', e)}

              setEditorFocus={setEditorFocus} />
          </div>
        </section>
      : t('loading')
      }

      <Modal
        isOpen={editedMetadata !== undefined}
        onRequestClose={unsetEditedMetadata}
        contentLabel="Modal"
        ariaHideApp={false}>
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
          onCancel={unsetEditedMetadata} />
      </Modal>
    </section>
);
};

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
