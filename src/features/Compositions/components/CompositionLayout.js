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
  assetsData = {},
  assets,

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

    createContextualization,
    updateContextualization,
    deleteContextualization,

    createContextualizer,
    updateContextualizer,
    deleteContextualizer,

    setEditedResource,

  },
  // custom functions
  summonAsset,
  getAssetUri,
}, {t}) => {
  const onOpenMetadata = () => {
    setEditedMetadata(editedComposition.metadata);
  };
  const resourcesMap = resources.reduce((res, resource) => ({
    ...res,
    [resource._id]: resource
  }), {});

  const assetsMap = assets.reduce((total, asset) => ({
    ...total,
    [asset._id]: asset,
  }), {});

  const onUpdateComposition = composition => {
    updateComposition(composition._id, composition);
  };

  const openResourceConfiguration = (id, resource) => setEditedResource(resource);

  return (
    <section className="plurishing-backoffice-Composition">
      <aside className="column is-one-quarter aside-picker">
        <ResourcesContainer />
      </aside>
      <section className="column is-three-quarter">
        {editedComposition ?
          <section className="composition-editor-wrapper">
            <div className="header">
              <h1 className="title is-1">
                <button onClick={onOpenMetadata}>{editedComposition.metadata.title}</button>
                <button onClick={onOpenMetadata} className="button is-primary">{t('metadata')}</button>
              </h1>
              <ul className="columns preview-mode-switcher">
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
                      <li key={option.id} className={'column'}>
                        <button className={`button is-fullwidth is-primary ${active ? 'is-active' : ''}`} onClick={onClick}>
                          {option.label}
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
                assets={assetsMap}

                assetsData={assetsData}
                getAssetUri={getAssetUri}

                composition={editedComposition}

                updateComposition={onUpdateComposition}
                editorStates={editorStates}

                renderingMode={previewMode}

                updateDraftEditorState={updateDraftEditorState}
                updateDraftEditorsStates={updateDraftEditorsStates}
                editorFocus={editorFocus}

                summonAsset={summonAsset}

                createContextualization={createContextualization}
                createContextualizer={createContextualizer}

                updateContextualizer={updateContextualizer}
                updateResource={e => console.log('update resource', e)}
                updateContextualization={updateContextualization}

                deleteContextualization={deleteContextualization}
                deleteContextualizer={deleteContextualizer}

                requestAsset={promptAssetRequest}
                cancelAssetRequest={unpromptAssetRequest}
                assetRequestState={assetRequestState}
                assetRequestPosition={assetRequestState.selection}
                assetEmbedType={'resources'}

                openResourceConfiguration={openResourceConfiguration}

                setEditorFocus={setEditorFocus} />
            </div>
          </section>
        : t('loading')
        }
      </section>

      <Modal
        isOpen={editedMetadata !== undefined}
        onRequestClose={unsetEditedMetadata}
        contentLabel="Modal"
        ariaHideApp={false}>
        <SchemaForm
          title={t('Edit composition')}
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
