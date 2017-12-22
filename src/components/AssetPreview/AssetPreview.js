/* eslint react/no-danger : 0 */
/**
 * This module provides a asset preview element component
 * @module plurishing-backoffice/components/AssetPreview
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import 'peritext-contextualizer-dicto/dist/main.css';
// import {Media, Player} from 'react-media-player';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';


import './AssetPreview.scss';


/**
 * EmbedContainer class for building react component instances
 * that wrap an embed/iframe element
 * (it is just aimed at preventing intempestuous reloading of embed code)
 */
class EmbedContainer extends Component {

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
  }


  /**
   * Defines whether the component should re-render
   * @param {object} nextProps - the props to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate(nextProps) {
    return this.props.html !== nextProps.html;
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      html
    } = this.props;
    return (<div
      dangerouslySetInnerHTML={{
            __html: html
          }} />);
  }
}


/**
 * Component's properties types
 */
EmbedContainer.propTypes = {

  /**
   * Raw html code to embed
   */
  html: PropTypes.string,
};


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
  previewMode = 'web',
  showPannel = false
}, context) => {
  const contextualizers = context.contextualizers || {};
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
    let ThatComponent;
    if (previewMode === 'web' && contextualizers[type] && contextualizers[type].BlockDynamic) {
      ThatComponent = contextualizers[type].BlockDynamic;
    }
    else if (previewMode === 'codex' && contextualizers[type] && contextualizers[type].BlockStatic) {
      ThatComponent = contextualizers[type].BlockStatic;
    }
    if (Component) {
      return (<ThatComponent
        resource={resource}
        contextualizer={contextualizer}
        contextualization={contextualization} />);
    }
  };
  return (
    <div className="plurishing-backoffice-AssetPreview">
      <div className="preview-container">{renderPreview()}</div>
      {showPannel && <div onClick={onClick} className="asset-metadata">
        {metadata.title && <h5>{metadata.title}</h5>}
        {metadata.description && <p>{metadata.description}</p>}
        <div>
          <button onClick={onClick}>{t('edit')}</button>
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
