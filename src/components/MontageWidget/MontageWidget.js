import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';
import Select from 'react-select';

import * as duck from '../../features/Montages/duck';

import {buildOperationToastr} from '../../helpers/toastr';

/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.montages),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class MontageWidget extends Component {

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
    if (this.props.montages.length === 0) {
      this.props.actions.getMontages();
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

  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      // name,
      value,
      onChange,
      montages,
      // mimetype accepted
      accept = [],
    } = this.props;
    const {
      t
    } = this.context;
    if (montages) {
      const options = montages
      .filter(montage => {
        if (accept.length > 0) {
          return accept.indexOf(montage.mimetype) > -1;
        }
        return true;
      })
      .map(montage => ({
        value: montage._id,
        label: montage.metadata.title || t('montage without name')
      }));
      return (
        <div>
          <Select
            options={options}
            value={value}
            onChange={e => onChange(e && e.value)} />
        </div>
      );
    }
 else {
      return (<div>
        {t('loading')}
      </div>
      );
    }
  }
}

export default MontageWidget;
