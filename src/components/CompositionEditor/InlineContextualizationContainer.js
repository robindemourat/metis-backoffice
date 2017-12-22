/**
 * This module provides a reusable Inline contextualization for the editor component
 * @module plurishing-backoffice/components/SectionEditor
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

/**
 * InlineContainer class for building react component instances
 */
class InlineContainer extends Component {


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
  shouldComponentUpdate() {
    // todo: optimize here
    return true;
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      asset,
    } = this.props;

    const {
      startExistingResourceConfiguration,
      contextualizers = {}
    } = this.context;

    const {
      resource = {},
      contextualizer,
      ...contextualization
    } = asset;

    const onEditRequest = () => {
      if (typeof startExistingResourceConfiguration === 'function') {
        startExistingResourceConfiguration(resource.metadata.id, resource);
      }
    };

    let ThatComponent;
    const type = resource.metadata && resource.metadata.type;

    if (contextualizers[type] && contextualizers[type].InlineDynamic) {
      ThatComponent = contextualizers[type].InlineDynamic;
      return (<ThatComponent
        type={type}
        data={resource.data}
        metadata={resource.metadata}
        onEditRequest={onEditRequest}
        resource={resource}
        contextualization={contextualization}
        contextualizer={contextualizer}
        showPannel />);
    }

    return null;
  }
}

/**
 * Component's properties types
 */
InlineContainer.propTypes = {
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
InlineContainer.contextTypes = {

  /**
   * Callbacks when resource configuration is asked from
   * within the asset component
   */
  startExistingResourceConfiguration: PropTypes.func,

  contextualizers: PropTypes.object,
};
export default InlineContainer;