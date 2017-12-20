import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';
import Select from 'react-select';

import * as duck from '../../features/Assets/duck';

import AssetPreview from './AssetPreview';

import Dropzone from 'react-dropzone';

import {buildOperationToastr} from '../../helpers/toastr';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.assets),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class AssetWidget extends Component {

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
    if (this.props.assets.length === 0) {
      this.props.actions.getAssets();
    }
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

  onDrop = files => {
    const file = files[0];
    const data = new FormData();
    const fileName = file.name;
    data.append('file', file);
    this.props.actions.createAsset(fileName, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
    .then(asset => {
      const created = this.props.assets.find(asset => asset.filename === fileName);
      if (created) {
        this.props.onChange(created._id);
      }
    })
  }

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      name,
      value,
      onChange,
      assets,
      // mimetype accepted
      accept = [],
    } = this.props;
    if (assets) {
      const options = assets
      .filter(asset => accept.length > 0 ? accept.indexOf(asset.mimetype) > -1 : true)
      .map(asset => ({
        value: asset._id,
        label: asset.filename
      }))
      return (
        <div>
          <Select
            options={options}
            value={value}
            onChange = {e => onChange(e && e.value)}
          />
          <Dropzone onDrop={this.onDrop}>
            Add new asset
          </Dropzone>
          <AssetPreview
            asset={assets && assets.find(asset => asset._id === value)}
          />
        </div>
      )
    } else {
      return (<div>
        Loading ...
      </div>
      )
    }
  }
}

export default AssetWidget;