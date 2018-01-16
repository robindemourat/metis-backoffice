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
import * as deliverableDuck from '../../Deliverables/duck';
import {buildOperationToastr} from '../../../helpers/toastr';
import {get} from '../../../helpers/client';

import getConfig from '../../../helpers/getConfig';
const {apiBaseUri} = getConfig();
const deliverableURLPrefix = `${apiBaseUri}deliverables/`;

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...deliverableDuck.selector(state.deliverables),
    ...duck.selector(state.diffusions),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...deliverableDuck,
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
    this.props.actions.getDeliverables();
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

  updateFormWithMontageId = (document, montageId) =>
    new Promise((resolve, reject) =>
      get('montages', {id: montageId})
              .then(data => {
                const montage = data.data;
                const transformedDocument = {
                  ...document,
                  montage_type: montage.metadata.montage_type,
                  montage_title: montage.metadata.title,
                  date_started: new Date().getTime(),
                };
                resolve(transformedDocument);
              })
              .catch(reject)
    )

  onAfterChange = (document, inputPath) =>
    new Promise((resolve, reject) => {
      if (this.props.montageId) {
        return this.updateFormWithMontageId(document, this.props.montageId)
                .then(resolve)
                .catch(reject);
      }
      else {
        const path = inputPath.join('.');
        switch (path.pop()) {
          case 'montage_id':
            return this.updateFormWithMontageId(document, document.montage_id)
                    .then(resolve)
                    .catch(reject);
          default:
            return resolve(document);
        }
      }
    })

  createDiffusion = diffusion => {
    this.props.actions.createDiffusion({
      ...diffusion,
    });
  }
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
      onAfterChange,
      createDiffusion,
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
        diffusions={activeDiffusions}
        createDiffusion={createDiffusion}
        deliverableURLPrefix={deliverableURLPrefix} />
    );
  }
}

export default DiffusionsContainer;
