/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the "forgot password" container
 * @module backoffice/features/Auth
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import ForgotPasswordLayout from './ForgotPasswordLayout';
import * as duck from '../duck';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.auth),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class ForgotPasswordContainer extends Component {

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
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate() {
    return true;
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <ForgotPasswordLayout
        {...this.props} />
    );
  }
}

export default ForgotPasswordContainer;
