/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the assets view
 * @module backoffice/features/Assets
 */
import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';

import getConfig from '../../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;
// import {assetsBaseUri} from '../../../../config';

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
    <section className="backoffice-Assets">
      <ul>
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
              <li key={index}>
                <p>{asset.filename}</p>
                <p>
                  <a target="blank" href={assetUrl}>{t('open asset')}</a>
                  - <button onClick={onDelete}>{t('delete asset')}</button></p>
                <Dropzone onDrop={onUpdateDrop} />
              </li>
            );
          })
        }
      </ul>
      <div>
        <h2>{t('add assets')}</h2>
        <Dropzone onDrop={onDrop} />
      </div>
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
