/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable resource search widget component.
 * It displays available resources and allow to search by text input
 * and go up in down with keyboard arrows in the list of search-matching items.
 * @module plurishing-backoffice/components/ContextualizationWidget
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions as toastrActions} from 'react-redux-toastr';
// import Select from 'react-select';

import getConfig from '../../helpers/getConfig';

import * as duck from '../../features/Resources/duck';

import './ContextualizationWidget.scss';

const config = getConfig();
const {timers} = config;

import {buildOperationToastr} from '../../helpers/toastr';


/**
 * Redux-decorated component class rendering the ContextualizationWidget component to the app
 */
@connect(
  state => ({
    ...duck.selector(state.resources),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
class ContextualizationWidget extends Component {


  /**
   * Component's context used properties
   */
  static contextTypes = {


    /**
     * Event emitter
     */
    emitter: PropTypes.object,

    /**
     * Translate function
     */
    t: PropTypes.func.isRequired,

    assetChoiceProps: PropTypes.object,

    /**
     * Redux store
     */
    store: PropTypes.object.isRequired,
  }

  constructor(props, context) {
    super(props);
    this.toastr = bindActionCreators(toastrActions, context.store.dispatch);
  }

  /**
   * Initial state
   */
  state = {

    /**
     * The current search input state
     */
    searchTerm: '',

    /**
     * the currently selected item in the list of available items
     */
    selectedItemIndex: 0,
  }

  componentWillMount () {
    if (this.props.resources.length === 0) {
      this.props.actions.getResources();
    }
  }


  /**
   * Executes code just after the component mounted
   */
  componentDidMount() {
    if (this.input) {
      setTimeout(() => {
        this.props.onAssetChoiceFocus();
        this.input.focus();
      }, timers.medium);
    }


    this.setState({/* eslint react/no-did-mount-set-state : 0 */
      ...this.context.assetChoiceProps
    });

    this.unsubscribe = this.context.emitter.subscribeToAssetChoiceProps((props) => {
      this.setState({...props});
    });
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

  componentWillUnmount() {
    this.unsubscribe();
  }


  /**
   * Callbacks when the search term is changed
   */
  onTermChange = (e) => {
    const searchTerm = e.target.value;
    e.stopPropagation();
    this.setState({
      searchTerm,
      selectedItemIndex: 0
    });
  }


  /**
   * Callbacks when a key is finished pressing
   */
  onKeyUp = e => {
    // escape pressed
    if (e.which === 27 && typeof this.props.onAssetRequestCancel === 'function') {
      this.props.onAssetRequestCancel();
    }
    // up arrow
    else if (e.which === 38) {
      let selectedItemIndex = this.state.selectedItemIndex || 0;
      selectedItemIndex = selectedItemIndex > 0 ? selectedItemIndex - 1 : 0;
      this.setState({
        selectedItemIndex
      });
    }
    // down arrow
    else if (e.which === 40) {
      let selectedItemIndex = this.state.selectedItemIndex || 0;
      selectedItemIndex = selectedItemIndex < this.props.options.length - 1 ? selectedItemIndex + 1 : this.props.options.length - 1;
      this.setState({
        selectedItemIndex
      });

    }
  }


  /**
   * Callbacks when user hits enter while focused in the input.
   */
  onSubmit = e => {
    e.stopPropagation();
    e.preventDefault();
    // @todo: search relevant instances in a better way
    const matching = this.props.options[this.props.activeMode]
            .filter(option => JSON.stringify(option).toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1);
    // add an asset
    if (matching.length) {
      this.props.onAssetChoice(matching[(this.state.selectedItemIndex || 0)], this.props.contentId);
    }
    // else interpret input as text to insert within contents
   else {
      this.props.addPlainText('@' + this.state.searchTerm, this.props.contentId);
    }
  }


  /**
   * Callbacks when user clicks on the input (force focus)
   */
  onInputClick = e => {
    e.stopPropagation();
    if (this.input) {
      this.input.focus();
      this.props.onAssetChoiceFocus();
      setTimeout(() => this.input.focus());
    }
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render () {
    const {
      onAssetChoice,
      // setActiveMode,
      resources,
    } = this.props;
    const {
      t
    } = this.context;

    // const activeOptions = options[activeMode] || [];
    const activeOptions = resources;

    const onOptionClick = option => {
      onAssetChoice(option, this.props.contentId);
    };
    const bindRef = input => {
      this.input = input;
    };
    return (
      <div className="plurishing-backoffice-ContextualizationWidget">
        <form className="search-form" onSubmit={this.onSubmit}>
          <span className="arobase">@</span>
          <input
            className="input"
            ref={bindRef}
            value={this.state.searchTerm}
            onBlur={this.onBlur}
            onChange={this.onTermChange}
            onKeyUp={this.onKeyUp}
            onClick={this.onInputClick}
            placeholder={t('search-a-resource')} />
        </form>
        <ul className="choice-options-container">
          {
            activeOptions
            .filter(option => JSON.stringify(option).toLowerCase().indexOf(this.state.searchTerm.toLowerCase()) > -1)
            .map((option, index) => {
              const onC = () => onOptionClick(option);
              const optionName = option.metadata.name || t('resource without name');
              const optionType = t(option.metadata.resource_type);

              return (<li
                className={'choice-option' + (index === this.state.selectedItemIndex ? ' active' : '')}
                key={index}
                onClick={onC}>
                <button className="button is-link is-fullwidth">{optionName} ({optionType})</button>
              </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
}

/**
 * Component's properties types
 */
ContextualizationWidget.propTypes = {

  /**
   * Active picker mode
   */
  activeMode: PropTypes.string,
  /**
   * Set active picker mode
   */
  setActiveMode: PropTypes.func,

  /**
   * Overall available options to the component
   */
  options: PropTypes.object,

  /**
   * Callbacks when an asset is choosen
   */
  onAssetChoice: PropTypes.func,
};

export default ContextualizationWidget;
