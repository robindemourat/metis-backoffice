/**
 * This module provides a reusable Inline contextualization for the editor component
 * @module metis-backoffice/components/SectionEditor
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import shared from 'metis-shared';
const {
  components: {contextualizers}
} = shared;
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
      renderingMode
    } = this.props;

    const {
      openResourceConfiguration
    } = this.context;

    const {
      resource = {},
      contextualizer,
      ...contextualization
    } = asset;

    const onEditRequest = e => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openResourceConfiguration === 'function') {
        openResourceConfiguration(resource.metadata._id, resource);
      }
    };

    let ThatComponent;
    const type = contextualizer.type;

    if (contextualizers[type] && contextualizers[type].Inline) {
      ThatComponent = contextualizers[type].Inline;
      return (<span onClick={onEditRequest} className="metis-backoffice-InlineContextualizationContainer button is-primary">
        <ThatComponent
          type={type}
          data={resource.data}
          metadata={resource.metadata}
          onEditRequest={onEditRequest}
          resource={resource}
          contextualization={contextualization}
          contextualizer={contextualizer}
          showPannel
          renderingMode={renderingMode} />
      </span>);
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
  openResourceConfiguration: PropTypes.func,

  contextualizers: PropTypes.object,
};
export default InlineContainer;
