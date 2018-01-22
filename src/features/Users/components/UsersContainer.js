/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the users container
 * @module metis-backoffice/features/Users
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import UsersLayout from './UsersLayout';
import * as duck from '../duck';
import * as authDuck from '../../Auth/duck';
import {buildOperationToastr} from '../../../helpers/toastr';


/**
 * Redux-decorated component class rendering the users container feature to the app
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
class UsersContainer extends Component {

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
    this.toastr = bindActionCreators(toastrActions, this.props.dispatch);
  }

  componentWillMount () {
    this.props.actions.getUsersList();
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

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <UsersLayout
        {...this.props} />
    );
  }
}

export default UsersContainer;
