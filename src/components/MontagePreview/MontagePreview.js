import React from 'react';

import MicroPublicationPreview from '../MicroPublicationPreview/MicroPublicationPreview';
import DynamicMontagePreview from '../DynamicMontagePreview/DynamicMontagePreview';
import StaticMontagePreview from '../StaticMontagePreview/StaticMontagePreview';

export default ({montage}) => {
  switch (montage.metadata.montage_type) {
    case 'micropublication':
      return <MicroPublicationPreview montage={montage} />;
    case 'dynamic':
      return <DynamicMontagePreview montage={montage} />;
    case 'static':
      return <StaticMontagePreview montage={montage} />;

    default:
      return null;
  }
};
