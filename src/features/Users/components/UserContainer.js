/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the single user container
 * @module backoffice/features/Users
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import UserLayout from './UserLayout';
import * as duck from '../duck';
import * as authDuck from '../../Auth/duck';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.users),
    ownUser: authDuck.selector(state.auth).user,
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class UserContainer extends Component {

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

  componentWillMount () {
    this.props.actions.getUser(this.props.params.id);
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
      <UserLayout
        {...this.props} />
    );
  }
}

export default UserContainer;
