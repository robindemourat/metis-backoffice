/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the user setup container
 * @module backoffice/features/Users
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import UserSetupLayout from './UserSetupLayout';
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
class UserSetupContainer extends Component {

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

  componentWillMount() {
    const {id, token} = this.props.router.params;
    this.props.actions.forgetUser();
    this.props.actions.signUp({id, token});
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user && !nextProps.user.resetPasswordToken) {
      // redirect to home once password is set
      nextProps.router.push('/');
    }
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
      <UserSetupLayout
        {...this.props} />
    );
  }
}

export default UserSetupContainer;
