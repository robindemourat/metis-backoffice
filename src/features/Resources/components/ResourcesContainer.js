/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the resources container
 * @module metis-backoffice/features/Resources
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import {Resource as schema} from 'metis-schemas';

import ResourcesLayout from './ResourcesLayout';
import * as duck from '../duck';
import {buildOperationToastr} from '../../../helpers/toastr';


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.resources),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class ResourcesContainer extends Component {

  /**
   * Context data used by the component
   */
  static contextTypes = {

    /**
     * Un-namespaced translate function
     */
    t: PropTypes.func.isRequired,

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired
  }

  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props, context) {
    super(props);
    this.toastr = bindActionCreators(toastrActions, context.store.dispatch);
  }

  componentWillMount () {
    this.props.actions.getResources();
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.clientStatus !== nextProps.clientStatus && nextProps.clientStatus) {
      const toastr = buildOperationToastr({
        operation: nextProps.clientOperation,
        status: nextProps.clientStatus,
        translations: {
          success: this.context.t('success'),
          requesting: this.context.t('requesting'),
          error: this.context.t('error')
        }
      });
      this.toastr.add(toastr);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  createResources = resources => {
    resources.forEach(resource => {
      this.props.actions.createResource(resource);
    });
  }
  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <ResourcesLayout
        schema={schema}
        createResources={this.createResources}
        {...this.props} />
    );
  }
}

export default ResourcesContainer;
