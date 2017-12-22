/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the diffusions container
 * @module plurishing-backoffice/features/Diffusions
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import {Diffusion as schema} from 'plurishing-schemas';

import DiffusionsLayout from './DiffusionsLayout';
import * as duck from '../duck';
import {buildOperationToastr} from '../../../helpers/toastr';
import {get} from '../../../helpers/client';


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.diffusions),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class DiffusionsContainer extends Component {

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
    this.props.actions.getDiffusions();
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

  onAfterChange = (document, inputPath) =>
    new Promise((resolve, reject) => {
      const path = inputPath.join('.');
      switch (path) {
        case 'montage_id':
          get('montages', {id: document.montage_id})
            .then(data => {
              const montage = data.data;
              const transformedDocument = {
                ...document,
                montage_type: montage.metadata.montage_type,
                montage_title: montage.metadata.title,
              };
              resolve(transformedDocument);
            })
            .catch(reject);
          break;
        default:
          return resolve(document);
      }
    })
  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      props: {
        montageId,
        montageType,
        diffusions = []
      },
      onAfterChange
    } = this;

    const activeDiffusions = montageId ?
      diffusions.filter(diffusion => diffusion.montage_id === montageId)
       : diffusions;

    return (
      <DiffusionsLayout
        {...this.props}
        schema={schema}
        onAfterChange={onAfterChange}
        montageId={montageId}
        montageType={montageType}
        diffusions={activeDiffusions} />
    );
  }
}

export default DiffusionsContainer;
