import React from 'react';
// import PropTypes from 'prop-types';

import {Media, Player, controls} from 'react-media-player';
const {PlayPause, MuteUnmute} = controls;

import Table from 'plurishing-shared/dist/components/contextualizers/Table/DynamicTable';
import TextPlayer from 'plurishing-shared/dist/components/contextualizers/Audio/TextPlayer';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

import 'react-table/react-table.css';

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
    case 'image/svg+xml':
      return <img src={assetUrl} />;

    case 'video/mp4':
    case 'video/x-msvideo':
    case 'video/mpeg':
    case 'video/ogg':
    case 'video/webm':
    case 'video/3gp':
    case 'audio/mpeg':
    case 'audio/mp3':
    case 'video/quicktime':
    case 'audio/mp4':
      return (
        <Media>
          <div className="media">
            <div className="media-player">
              <Player src={assetUrl} />
            </div>
            <div className="media-controls">
              <PlayPause />
              <MuteUnmute />
            </div>
          </div>
        </Media>
      );

    case 'text/csv':
    case 'text/tsv':
      return (
        <Table
          src={assetUrl} />
      );

    case 'application/x-subrip':
    case 'text/srt':
    case 'text/plain':
      return <TextPlayer src={assetUrl} />;
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
}, /*{t}*/) => {
  if (asset) {
    return (
      <div className="plurishing-backoffice-PrimitiveAssetPreview">
        {render(asset)}
      </div>
    );
  }
  return null;
};

// AssetPreview.contextTypes = {
//   t: PropTypes.func.isRequired,
// };

export default AssetPreview;
