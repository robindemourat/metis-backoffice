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
const {assetsBaseUri} = config;
// import {assetsBaseUri} from '../../../../config';

import './AssetsLayout.scss';

const AssetsLayout = ({
  assets = [],

  actions: {
    uploadAsset,
    deleteAsset,
  }
}, {t}) => {
  const onDrop = files => {
    files.forEach(file => {
      const data = new FormData();
      const fileName = encodeURIComponent(file.name);
      data.append('file', file);
      uploadAsset(fileName, data, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
      });
    });
  };
  return (
    <section className="backoffice-Assets">
      <ul>
        {
          assets.map((asset, index) => {
            const onDelete = () => deleteAsset(encodeURIComponent(asset));
            return (
              <li key={index}>
                <p>{asset}</p>
                <p><a target="blank" href={`${assetsBaseUri}${asset}`}>{t('open asset')}</a> - <button onClick={onDelete}>{t('delete asset')}</button></p>
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
