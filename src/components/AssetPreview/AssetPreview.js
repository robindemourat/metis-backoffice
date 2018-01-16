/* eslint react/no-danger : 0 */
/**
 * This module provides a asset preview element component
 * @module plurishing-backoffice/components/AssetPreview
 */
import React from 'react';
import PropTypes from 'prop-types';
import shared from 'plurishing-shared';
const {
  components: {contextualizers}
} = shared;

import 'react-table/react-table.css';

import './AssetPreview.scss';


/**
 * Renders the AssetPreview component as a pure function
 * @param {object} props - used props (see prop types below)
 * @param {object} context - used context data (see context types below)
 * @return {ReactElement} component - the resulting component
 */
const AssetPreview = ({
  type,
  resource,
  contextualization,
  contextualizer,
  metadata = {},
  onEditRequest,
  showPannel = false,
  renderingMode
}, context) => {
  const t = context.t;
  const onClick = e => {
    e.stopPropagation();
    if (typeof onEditRequest === 'function') {
      onEditRequest();
    }
  };


  /**
   * Builds the appropriate preview against asset type
   * @return {ReactElement} component - appropriate component
   */
  const renderPreview = () => {
    const lib = contextualizers[type];
    if (lib && lib.Block) {
      const ThatComponent = lib.Block;
      return (
        <ThatComponent
          resource={resource}
          contextualizer={contextualizer}
          contextualization={contextualization}
          renderingMode={renderingMode} />
      );
    }
    return null;
  };

  return (
    <div className="plurishing-backoffice-AssetPreview">
      <div className={`preview-container ${contextualizer.type}`}>
        {renderPreview()}
      </div>
      {showPannel && <div onClick={onClick} className="asset-metadata">
        {metadata.title && <h5>{metadata.title}</h5>}
        {metadata.description && <p>{metadata.description}</p>}
        <div>
          <button className="button is-primary is-fullwidth" onClick={onClick}>{t('edit')}</button>
        </div>
      </div>}
    </div>);
};


/**
 * Component's properties types
 */
AssetPreview.propTypes = {

  /**
   * Type of the asset
   */
  type: PropTypes.string,

  /**
   * Metadata of the asset
   */
  metadata: PropTypes.object,

  /**
   * Data of the asset
   */
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),

  /**
   * Whether to show the pannel displaying asset metadata
   */
  showPannel: PropTypes.bool,

  /**
   * Callbacks when asset is asked for edition from component
   */
  onEditRequest: PropTypes.func,
};


/**
 * Component's context used properties
 */
AssetPreview.contextTypes = {

  /**
   * translation function
   */
  t: PropTypes.func.isRequired,

  contextualizers: PropTypes.object,

  datasets: PropTypes.object,
};

export default AssetPreview;
