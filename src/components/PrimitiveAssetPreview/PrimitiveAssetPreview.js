import React from 'react';
import PropTypes from 'prop-types';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

import './PrimitiveAssetPreview.scss';

const render = asset => {
  const attachmentName = asset.filename;
  const assetUrl = `${apiBaseUri}assets/${asset._id}/${attachmentName}`;
  switch (asset.mimetype) {
    case 'application/pdf':
    case 'text/markdown':
      return <iframe src={assetUrl} />;

    case 'image/png':
    case 'image/jpg':
    case 'image/jpeg':
    case 'image/gif':
      return <img src={assetUrl} />;

    default:
      return (
        <div>
          No preview available {asset.mimetype}
        </div>
      );
  }
};

const AssetPreview = ({
  asset
}, {t}) => {
  if (asset) {
    return (
      <div className="plurishing-backoffice-PrimitiveAssetPreview">
        <h3>{t('preview')}</h3>
        {render(asset)}
      </div>
    );
  }
  return null;
};

AssetPreview.contextTypes = {
  t: PropTypes.func.isRequired,
};

export default AssetPreview;
