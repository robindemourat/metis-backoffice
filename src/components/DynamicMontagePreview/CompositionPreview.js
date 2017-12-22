import React from 'react';

import ArticlePreview from './ArticlePreview';
import FullScreenPreview from './FullScreenPreview';

export default ({
  parameters,
  composition,
  assets,
  resources
}) => {
  let Component = null;
  switch (parameters.template) {
    case 'article':
      Component = ArticlePreview;
      break;
    case 'fullscreen':
      Component = FullScreenPreview;
      break;
    default:
      break;
  }

  return (
    <div>
      <Component
        parameters={parameters}
        composition={composition}
        assets={assets}
        resources={resources} />
      <style>
        {parameters.css_code}
      </style>
    </div>
  );
};
