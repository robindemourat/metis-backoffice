/* eslint react/no-set-state: 0 */
/**
 * This module provides a reusable resource search widget component.
 * It displays available resources and allow to search by text input
 * and go up in down with keyboard arrows in the list of search-matching items.
 * @module ovide/components/ContextualizationWidget
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import getConfig from '../../helpers/getConfig';

import AsideToggler from '../AsideToggler/AsideToggler';


import './ContextualizationWidget.scss';

const config = getConfig();

/**
 * ContextualizationWidget class for building react component instances
 */
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
      options = {},
      activeMode,
    } = this.state;
    const {
      onAssetChoice,
      setActiveMode,
    } = this.props;
    const context = this.context;

    const activeOptions = options[activeMode] || [];

    const onOptionClick = option => {
      onAssetChoice(option, this.props.contentId, activeMode);
    };
    const bindRef = input => {
      this.input = input;
    };
    return (
      <div className="plurishing-backoffice-ContextualizationWidget">
        <AsideToggler
          options={[
          {
            id: 'resources',
            name: t('widget-pick-resource'),
            help: t('widget-pick-resource-help'),
          },
         /*{
            id: 'sections',
            name: t('widget-pick-section'),
            help: t('widget-pick-section-help'),
          },}
          {
            id: 'figure',
            name: translate('widget-pick-figure'),
            help: translate('widget-pick-figure-help'),
          },*/
          ]}
          activeOption={activeMode}
          setOption={setActiveMode} />
        <form className="search-form" onSubmit={this.onSubmit}>
          <span className="arobase">@</span>
          <input
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
              let optionName;
              const {
                data,
                metadata
              } = option;
              if (metadata.type === 'bib') {
                optionName = data[0] && data[0].title && data[0].title.length ? data[0].title : t('untitled-asset');
              }
              else if (metadata.type === 'glossary') {
                optionName = data.name && data.name.length ? data.name : t('untitled-asset');
              }
              else {
                optionName = metadata.title && metadata.title.length ? metadata.title : t('untitled-asset');
              }
              return (<li
                className={'choice-option' + (index === this.state.selectedItemIndex ? ' active' : '')}
                key={index}
                onClick={onC}>{optionName}</li>
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
