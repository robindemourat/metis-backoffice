/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the home container
 * @module backoffice/features/Home
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import NewUserLayout from './NewUserLayout';
import * as duck from '../duck';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.users),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class NewUserContainer extends Component {

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
      <NewUserLayout
        {...this.props} />
    );
  }
}

export default NewUserContainer;
