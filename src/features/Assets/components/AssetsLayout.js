/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the assets view
 * @module backoffice/features/Assets
 */
import React from 'react';
import PropTypes from 'prop-types';
import DropZone from '../../../components/DropZone/DropZone';

import getConfig from '../../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

// import AssetPreview from '../../../components/PrimitiveAssetPreview/PrimitiveAssetPreview';


import './AssetsLayout.scss';

const AssetsLayout = ({
  assets = [],

  actions: {
    createAsset,
    updateAsset,
    deleteAsset,
  }
}, {t}) => {
  const onDrop = files => {
    // uploading the files one after the other
    // (todo: refactor for a server-side bulk operation)
    files.reduce((p, file) => {
      const data = new FormData();
      const fileName = file.name;
      data.append('file', file);
      return p.then(() => {
        return createAsset(fileName, data, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        });
      });
    }, Promise.resolve());
  };
  return (
    <section className="metis-backoffice-Assets container is-fluid">
      <section className="section">
        <h1 className="title is-1">{t('Assets')}</h1>
      </section>
      <ul className="section">
        <li className="box section">
          <article className="media">
            <div className="media-content">
              <h2 className="title">{t('Add new assets')}</h2>
              <DropZone onDrop={onDrop}>
                {t('drop new assets here')}
              </DropZone>
            </div>
          </article>
        </li>
        {
          assets.map((asset, index) => {
            const onDelete = () => deleteAsset(asset._id, asset);
            const attachmentName = asset.filename;
            const assetUrl = `${apiBaseUri}assets/${asset._id}/${attachmentName}`;
            const onUpdateDrop = files => {
              const file = files[0];
              const data = new FormData();
              data.append('file', file);
              updateAsset(asset._id, data, {
                  headers: {
                    'Content-Type': 'multipart/form-data'
                  }
              });
            };
            return (
              <li key={index} className="box">
                <article className="media">
                  <div className="media-left">
                    <DropZone onDrop={onUpdateDrop}>
                      {t('drop a new file to update the asset')}
                    </DropZone>
                  </div>
                  <div className="media-content">
                    <div className="content">
                      <p className="title">{asset.filename}</p>

                      <p>{asset.mimetype}</p>
                      <p>
                        <a className="button is-primary" target="blank" href={assetUrl}>{t('open asset')}</a>
                        <button className="button is-danger" onClick={onDelete}>{t('delete asset')}</button>
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })
        }
      </ul>
    </section>
  );
};

/**
 * Context data used by the component
 */
AssetsLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default AssetsLayout;
