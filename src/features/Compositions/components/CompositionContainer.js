/**
 * This module exports a stateful component connected to the redux logic of the app,
 * dedicated to rendering the compositions container
 * @module plurishing-backoffice/features/Compositions
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {v4 as genId} from 'uuid';
import {actions as toastrActions} from 'react-redux-toastr';

import {Composition as schema} from 'plurishing-schemas';

import CompositionLayout from './CompositionLayout';
import * as duck from '../duck';
import * as resourcesDuck from '../../Resources/duck';
import * as assetsDuck from '../../Assets/duck';
import {buildOperationToastr} from '../../../helpers/toastr';

import {
  // insertAssetInEditor,
  insertInlineContextualization,
  insertBlockContextualization,
} from '../../../helpers/draftUtils';

import getConfig from '../../../helpers/getConfig';
const {apiBaseUri} = getConfig();


/**
 * Redux-decorated component class rendering the takeaway dialog feature to the app
 */
@connect(
  state => ({
    ...duck.selector(state.compositions),
    ...resourcesDuck.selector(state.resources),
    ...assetsDuck.selector(state.assets),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...resourcesDuck,
      ...assetsDuck,
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
      .then(() => {
        const editedComposition = this.props.compositions.find(thatComposition => thatComposition._id === this.props.params.id);
        this.props.actions.setEditedComposition(editedComposition);
      });
    this.props.actions.getAssets();
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
   * Handle the process of creating a new asset in the active story.
   * This implies three operations :
   * - create a contextualizer (which defines a way of materializing the resource)
   * - create contextualization (unique combination of a contextualizer, a composition and a resource)
   * - insert an entity linked to the contextualization in the proper draft-js content state (main or note of the composition)
   * @param {string} contentId - the id of editor to target ('main' or note id)
   * @param {string} resourceId - id of the resource to summon
   */
  summonAsset = (contentId, resourceId) => {
    const {
      editorStates,
      actions,
      editedComposition,
      resources
    } = this.props;

    const {
      createContextualizer,
      createContextualization,
      updateDraftEditorState,
      updateComposition,
    } = actions;


    const activeComposition = editedComposition;
    const activeCompositionId = activeComposition._id;
    const resource = resources.find(res => res._id === resourceId);


    // 1. create contextualizer
    // question: why isn't the contextualizer
    // data directly embedded in the contextualization data ?
    // answer: that way we can envisage for the future to
    // give users a possibility to reuse the same contextualizer
    // for different resources (e.g. comparating datasets)
    // and we can handle multi-modality in a smarter way.


    // 0. get the proper editor state and variables
    const editorStateId = contentId === 'main' ? activeCompositionId : contentId;
    const editorState = editorStates[editorStateId];
    const currentContent = editorState.getCurrentContent();
    const inputSelection = editorState.getSelection();

    // choose if inline or block
    const isInEmptyBlock = currentContent
                          .getBlockForKey(inputSelection.getStartKey())
                          .getText()
                          .trim().length === 0;
    const insertionType = isInEmptyBlock ? 'block' : 'inline';

    /**
     * @todo in schemas and code rename resource_type to resource_type for consistency
     */
    const resourceType = resource.metadata.resource_type;
    /**
     * @todo : consume a schema for attributing default contextualizer to a given resource type
     */
    let contextualizerType;
    // for inline use bib by default
    if (insertionType === 'inline' && resourceType !== 'bib' && resourceType !== 'webpage') {
        contextualizerType = 'bib';
    // for all other contextualization situations use provided contextualizer
    }
    else {
      contextualizerType = resource.metadata.resource_type;
    }
    const contextualizerId = genId();

    const contextualizer = {
      id: contextualizerId,
      type: contextualizerType,
      insertionType,
    };
    createContextualizer(contextualizerId, contextualizer);


    // 2. create contextualization
    const contextualizationId = genId();
    const contextualization = {
      id: contextualizationId,
      resourceId,
      contextualizerId
    };
    createContextualization(contextualizationId, contextualization);


    // update related editor state
    const newEditorState = insertionType === 'block' ?
      insertBlockContextualization(editorState, contextualization, contextualizer, resource) :
      insertInlineContextualization(editorState, contextualization, contextualizer, resource);
    // update immutable editor state
    updateDraftEditorState(editorStateId, newEditorState);
    // update serialized editor state
    // let newComposition;
    // if (contentId === 'main') {
    //   newComposition = {
    //     ...activeComposition,
    //     contents: convertToRaw(newEditorState.getCurrentContent())
    //   };
    // }
    // else {
    //   newComposition = {
    //     ...activeComposition,
    //     notes: {
    //       ...activeComposition.notes,
    //       [contentId]: {
    //         ...activeComposition.notes[contentId],
    //         contents: convertToRaw(newEditorState.getCurrentContent())
    //       }
    //     }
    //   };
    // }
    setTimeout(() => {
      updateComposition(this.props.editedComposition._id, this.props.editedComposition);
    });
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
      <CompositionLayout
        schema={schema}
        summonAsset={this.summonAsset}
        getAssetUri={this.getAssetUri}
        {...this.props} />
    );
  }
}

export default CompositionContainer;
