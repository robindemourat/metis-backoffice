/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the user setup container
 * @module metis-backoffice/features/Users
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import UserSetupLayout from './UserSetupLayout';
import * as duck from '../duck';

import {buildOperationToastr} from '../../../helpers/toastr';


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
  constructor(props, context) {
    super(props);
    this.toastr = bindActionCreators(toastrActions, context.store.dispatch);
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
      <UserSetupLayout
        {...this.props} />
    );
  }
}

export default UserSetupContainer;
