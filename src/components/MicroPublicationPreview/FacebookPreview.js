import React from 'react';

import Profile from './assets/facebook-profile-placeholder.jpg';

import './FacebookPreview.scss';

export default ({
  montage: {
    data: {
      include_abstract: includeAbstract,
      montage_url: montageUrl
    },
  },
  composition: {
      metadata: {
        title,
        abstract_original: abstractOriginal
      }
    }
}) => {
  return (
    <div className="plurishing-backoffice-FacebookPreview">
      <div className="header">
        <div className="left">
          <img className="profile-image" src={Profile} />
        </div>
        <div className="right">
          <div className="row">
            <h3 className="fb-important">Plurishing</h3>
            <p className="post-info">Publié par Michel · 8 mars 2016 </p>
          </div>
        </div>
      </div>
      <div className="body">
        <b>{title}</b>
        <br />
        {includeAbstract && <p>
            {abstractOriginal}
          </p>}
        <p>
          {montageUrl}
        </p>
      </div>
    </div>
  );
};
