/**
 * This module provides a reusable block contextualization for the editor component
 * @module plurishing-backoffice/components/SectionEditor
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Textarea from 'react-textarea-autosize';

import AssetPreview from '../AssetPreview/AssetPreview';

/**
 * BlockContainer class for building react component instances
 */
class BlockContainer extends Component {


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
   * @param {object} nextState - the state to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate(nextProps) {
    const {
      asset: {
        resource,
        contextualizer,
        legend,
        title
      },
      renderingMode
    } = this.props;
    const {
      asset: {
        resource: nextResource,
        contextualizer: nextContextualizer,
        legend: nextLegend,
        title: nextTitle
      },
      renderingMode: nextRenderingMode
    } = nextProps;
    // return true;
    return (
      resource !== nextResource ||
      contextualizer !== nextContextualizer ||
      legend !== nextLegend ||
      title !== nextTitle ||
      renderingMode !== nextRenderingMode
    );
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      props: {
        asset,
        onAssetChange,
        onAssetFocus,
        onAssetBlur,
        renderingMode,
      },
      context: {
        openResourceConfiguration,
        // lang = 'en',
        t,
      },
    } = this;

    const {
      resource,
      contextualizer,
      ...contextualization
    } = asset;

    // const {
    //   visibility = {
    //     codex: true,
    //     web: true
    //   },
    // } = contextualizer;

    const {
      legend = '',
      title = '',
    } = contextualization;

    const onEditRequest = e => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (typeof openResourceConfiguration === 'function') {
        openResourceConfiguration(resource._id, resource);
      }
    };

    // const setContextualizerType = type => {
    //   onAssetChange('contextualizer', contextualizer.id, {
    //     insertionType: contextualizer.insertionType,
    //     id: contextualizer.id,
    //     previewMode: contextualizer.previewMode,
    //     type,
    //   });
    // };

    // const setContextualizerOption = (key, value) => {
    //   onAssetChange('contextualizer', contextualizer.id, {
    //     ...contextualizer,
    //     [key]: value,
    //   });
    // };

    const onLegendChange = e => {
      const thatLegend = e.target.value;
      onAssetChange('contextualization', contextualization.id, {
        ...contextualization,
        legend: thatLegend,
      });
    };

    const onTitleChange = e => {
      const thatTitle = e.target.value;
      onAssetChange('contextualization', contextualization.id, {
        ...contextualization,
        title: thatTitle,
      });
    };

    const onInputClick = e => {
      onAssetFocus(e);
    };

    // const possibleContextualizersTypes = Object.keys(contextualizers)
    //   .filter(id => {
    //     const lib = contextualizers[id];
    //     const possible = lib && lib.metadata && lib.metadata.model
    //       && lib.metadata.coverage.blockDynamic
    //       && lib.metadata.model.acceptedResourceTypes
    //       && lib.metadata.model.acceptedResourceTypes
    //           .filter(obj => {
    //             if (obj.type) {
    //               return resource.metadata.type === obj.type;
    //             }
    //             else if (obj.test) {
    //               return obj.test(resource);
    //             }
    //           }).length > 0;
    //     return possible === true;
    //   });

    const preventClick = e => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <div className="plurishing-backoffice-BlockContextualizationContainer" onClick={preventClick}>

        <AssetPreview
          type={contextualizer.type}
          data={resource.data}
          metadata={resource.metadata}
          onEditRequest={onEditRequest}
          resource={resource}
          contextualization={contextualization}
          contextualizer={contextualizer}
          renderingMode={renderingMode}
          showPannel />
        <form className="legend-container">
          <div className="field">
            <label className="label">{t('title')}</label>
            <div className="control">
              <input
                className="input"
                value={title}
                onClick={onInputClick}
                onChange={onTitleChange}
                placeholder={t('title-placeholder')}
                onFocus={onAssetFocus}
                onBlur={onAssetBlur} />
            </div>
          </div>
          <div className="field">
            <label className="label">{t('legend')}</label>
            <div className="control">
              <Textarea
                className="textarea"
                value={legend}
                onClick={onInputClick}
                onChange={onLegendChange}
                placeholder={t('legend-placeholder')}
                onFocus={onAssetFocus}
                onBlur={onAssetBlur} />
            </div>
          </div>
        </form>
      </div>
    );
  }
}

/**
 * Component's properties types
 */
BlockContainer.propTypes = {
  /*
   * the asset to render
   */
  asset: PropTypes.shape({
    resource: PropTypes.object,
  })
};


/**
 * Component's context used properties
 */
BlockContainer.contextTypes = {

  /**
   * Callbacks when resource configuration is asked from
   * within the asset component
   */
  openResourceConfiguration: PropTypes.func,

  t: PropTypes.func,

  lang: PropTypes.string,

  renderingMode: PropTypes.string,
};
export default BlockContainer;
