/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the compositions container
 * @module plurishing-backoffice/features/Compositions
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import {Composition as schema} from 'plurishing-schemas';

import CompositionLayout from './CompositionLayout';
import * as duck from '../duck';
import {buildOperationToastr} from '../../../helpers/toastr';


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.compositions),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class CompositionContainer extends Component {

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
    this.props.actions.getComposition(this.props.params.id)
      .then(comp => {
        const editedComposition = this.props.compositions.find(comp => comp._id === this.props.params.id);
        this.props.actions.setEditedComposition(editedComposition);
      })
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
      <CompositionLayout
        schema={schema}
        {...this.props} />
    );
  }
}

export default CompositionContainer;
