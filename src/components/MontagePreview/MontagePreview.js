import React from 'react';

import MicroPublicationPreview from '../MicroPublicationPreview/MicroPublicationPreview';
import DynamicMontagePreview from '../DynamicMontagePreview/DynamicMontagePreview';
import StaticMontagePreview from '../StaticMontagePreview/StaticMontagePreview';

export default ({
  assets,
  resources,
  compositions,
  montage,
  getAssetUri,
  citationStyle,
  citationLocale
}) => {
  switch (montage.metadata.montage_type) {
    case 'micropublication':
      return (<MicroPublicationPreview
        montage={montage}
        getAssetUri={getAssetUri}
        assets={assets} />);
    case 'dynamic':
      return (<DynamicMontagePreview
        assets={assets}
        resources={resources}
        compositions={compositions}
        montage={montage}
        getAssetUri={getAssetUri}
        citationStyle={citationStyle}
        citationLocale={citationLocale} />);
    case 'static':
      return (<StaticMontagePreview
        assets={assets}
        resources={resources}
        compositions={compositions}
        montage={montage}
        getAssetUri={getAssetUri}
        citationStyle={citationStyle}
        citationLocale={citationLocale} />);

    default:
      return null;
  }
};
