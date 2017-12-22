import React from 'react';

import MicroPublicationPreview from './MicroPublicationPreview';

export default ({montage}) => {
  switch (montage.metadata.montage_type) {
    case 'micropublication':
      return <MicroPublicationPreview montage={montage} />;
    default:
      return null;
  }
};
