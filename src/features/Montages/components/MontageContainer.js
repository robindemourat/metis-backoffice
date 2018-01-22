/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the montages container
 * @module metis-backoffice/features/Montages
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';

import {Montage as schema} from 'metis-schemas';

import MontageLayout from './MontageLayout';
import * as duck from '../duck';

import * as assetsDuck from '../../Assets/duck';
import * as resourcesDuck from '../../Resources/duck';
import * as compositionsDuck from '../../Compositions/duck';

import {buildOperationToastr} from '../../../helpers/toastr';

import getConfig from '../../../helpers/getConfig';
const {apiBaseUri} = getConfig();


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...assetsDuck.selector(state.assets),
    ...resourcesDuck.selector(state.resources),
    ...compositionsDuck.selector(state.compositions),
    ...duck.selector(state.montages),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...assetsDuck,
      ...resourcesDuck,
      ...compositionsDuck,
      ...duck,
    }, dispatch)
  })
)
class MontageContainer extends Component {

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
    this.props.actions.getMontage(this.props.params.id)
      .then(() => {
        const editedMontage = this.props.montages.find(thatComposition => thatComposition._id === this.props.params.id);
        this.props.actions.setEditedMontage(editedMontage);
      });
    /**
     * @todo require data wisely for montage preview
     * @body for now it loads all assets, compositions, and resources, but it should load
     * only the ones needed
     */
    this.props.actions.getAssets();
    this.props.actions.getCompositions();
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

  getAssetUri = asset => {
    return `${apiBaseUri}/assets/${asset._id}/${asset.filename}`;
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    return (
      <MontageLayout
        schema={schema}
        getAssetUri={this.getAssetUri}
        {...this.props} />
    );
  }
}

export default MontageContainer;
