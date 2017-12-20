import React from 'react';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

const render = asset => {
  const attachmentName = asset.filename;
  const assetUrl = `${apiBaseUri}assets/${asset._id}/${attachmentName}`;
  switch(asset.mimetype) {
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
      )
  }
}

export default ({
  asset
}) => asset ? 
  (
    <div>
      <h3>Preview</h3>
      {render(asset)}
    </div>
  )
: null