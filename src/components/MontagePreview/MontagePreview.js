import React from 'react';

import MicroPublicationPreview from '../MicroPublicationPreview/MicroPublicationPreview';
import DynamicMontagePreview from '../DynamicMontagePreview/DynamicMontagePreview';
import StaticMontagePreview from '../StaticMontagePreview/StaticMontagePreview';

export default ({montage, getAssetUri}) => {
  switch (montage.metadata.montage_type) {
    case 'micropublication':
      return <MicroPublicationPreview montage={montage} getAssetUri={getAssetUri} />;
    case 'dynamic':
      return <DynamicMontagePreview montage={montage} getAssetUri={getAssetUri} />;
    case 'static':
      return <StaticMontagePreview montage={montage} getAssetUri={getAssetUri} />;

    default:
      return null;
  }
};
