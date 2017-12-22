/**
 * This module provides a wrapper for displaying composition editor in plurishing-backoffice editor
 * @module plurishing-backoffice/components/CompositionEditor
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {debounce} from 'lodash';

import {ReferencesManager} from 'react-citeproc';

import {v4 as generateId} from 'uuid';

import {
  EditorState,
  Modifier,
  convertToRaw,
  convertFromRaw,
  CharacterMetadata
} from 'draft-js';

import {
  getSelectedBlocksList
} from 'draftjs-utils';

import {resourceToCslJSON} from 'peritext-rendering-utils';

// import CompositionLink from './CompositionLink/CompositionLink';
// import compositionLinkStrategy from './CompositionLink/strategy';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {timers} = config;// time constants for the setTimeouts latency consistency


/**
 * Scholar-draft is a custom component wrapping draft-js editors
 * for the purpose of this app.
 * See https://github.com/peritext/scholar-draft
 */
import Editor, {
  utils,
  constants
} from 'scholar-draft';

const {
  INLINE_ASSET,
  NOTE_POINTER,
  SCHOLAR_DRAFT_CLIPBOARD_CODE
} = constants;

const {
  deleteNoteFromEditor,
  getUsedAssets,
  updateNotesFromEditor,
  insertNoteInEditor,
  insertFragment,
} = utils;

import defaultStyle from 'raw-loader!./assets/apa.csl';
import defaultLocale from 'raw-loader!./assets/english-locale.xml';

// import BlockContextualizationContainer from './BlockContextualizationContainer';
// import InlineContextualizationContainer from './InlineContextualizationContainer';

import ContextualizationWidget from '../ContextualizationWidget/ContextualizationWidget';

// import InlineCitation from '../InlineCitation/InlineCitation';
// import GlossaryMention from '../GlossaryMention/GlossaryMention';

import Bibliography from './Bibliography';


/**
 * We have to provide scholar-draft the components
 * we want to use to display the assets in the editor.
 * For inline assets we have a component for each asset type
 * and we cannot use those provided by contextualizers modules as they must be editable
 */
const inlineAssetComponents = {
  // bib: InlineCitation,
  // glossary: GlossaryMention,
};


/**
 * For block assets for now a wrapping component is used
 * that chooses the proper contextualization component
 * one level lower
 */
const blockAssetComponents = {
  // 'bib': BlockContextualizationContainer,
  // 'codefiles': BlockContextualizationContainer,
  // 'data-presentation': BlockContextualizationContainer,
  // 'dicto': BlockContextualizationContainer,
  // 'embed': BlockContextualizationContainer,
  // 'image': BlockContextualizationContainer,
  // 'p5': BlockContextualizationContainer,
  // 'table': BlockContextualizationContainer,
  // 'vegalite': BlockContextualizationContainer,
  // 'video': BlockContextualizationContainer,
  // 'webpage': BlockContextualizationContainer,
};


import './CompositionEditor.scss';


/**
 * CompositionEditor class for building react component instances
 */
class CompositionEditor extends Component {


  /**
   * Component's context used properties
   */
  static contextTypes = {

    /**
     * Un-namespaced translate function
     */
    t: PropTypes.func.isRequired,
  }


  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);
    const assets = this.makeAssets(props);
    const {
      citationData,
      citationItems
    } = this.makeCitationData(props, assets);
    this.state = {
      hydrated: false,
      citationData,
      citationItems,
      assets,
    };
    // this.updateCompositionRawContent = this.updateCompositionRawContent.bind(this);
    this.updateCompositionRawContent = this.updateCompositionRawContent.bind(this);
    this.updateCompositionRawContentDebounced = debounce(this.updateCompositionRawContent, 2000);
    this.debouncedCleanStuffFromEditorInspection = debounce(this.cleanStuffFromEditorInspection, 500);
    // this.debouncedCleanStuffFromEditorInspection = this.cleanStuffFromEditorInspection.bind(this);
  }


  /**
   * Provides children new context data each time props or state has changed
   */
  getChildContext = () => ({
    startExistingResourceConfiguration: this.props.startExistingResourceConfiguration,
    lang: this.props.lang,
  });

  /**
   * Executes code just after component mounted
   */
  componentDidMount() {
    const {
      compositionId,
      activeComposition
    } = this.props;
    if (compositionId && activeComposition.contents && Object.keys(activeComposition.contents).length) {
      this.hydrateEditorStates(activeComposition);
    }
    document.addEventListener('copy', this.onCopy);
    document.addEventListener('cut', this.onCopy);
    document.addEventListener('paste', this.onPaste);
  }


  /**
   * Executes code when component receives new properties
   * @param {object} nextProps - the future properties of the component
   */
  componentWillReceiveProps(nextProps) {
    if (this.props.compositionId !== nextProps.compositionId) {
      const {
        activeComposition
      } = nextProps;

      const assets = this.makeAssets(nextProps);
      const {
        citationData,
        citationItems,
      } = this.makeCitationData(nextProps, assets);

      /**
       * We want to ensure updateCompositionRawContent will not be
       * updated before editor states are hydrated
       * so we lock the possible update callbacks until
       * the component is hydrated
       */
      this.setState({
        locked: true,
        assets,
        citationData,
        citationItems,
      });
      setTimeout(() => {
        this.updateCompositionRawContent('main', this.props.activeStoryId, this.props.compositionId);
        this.hydrateEditorStates(activeComposition);
        this.setState({
          locked: undefined
        });
      }, 500);
    }

    if (this.props.story && nextProps.story && this.props.story.contextualizations !== nextProps.story.contextualizations) {
      const assets = this.makeAssets(nextProps);
      const {
        citationData,
        citationItems,
      } = this.makeCitationData(nextProps, assets);
      this.setState({
        assets,
        citationData,
        citationItems,
      });
    }
    else if (
      this.props.story.contextualizers !== nextProps.story.contextualizers ||
      this.props.story.resources !== nextProps.story.contextualizers ||
      this.props.story.settings !== nextProps.story.settings
      ) {
      this.setState({
        assets: this.makeAssets(nextProps)
      });
    }
  }

  // componentWillUpdate() {
  //   // benchmarking component performance
  //   console.time('editor update time');
  // }


  /**
   * Executes code after component re-rendered
   */
  componentDidUpdate = (prevProps) => {
    if (!this.state.locked && this.props.editorStates[this.props.activeComposition.id] !== prevProps.editorStates[this.props.activeComposition.id]) {
      this.debouncedCleanStuffFromEditorInspection(this.props.activeComposition.id);
    }
    // console.timeEnd('editor update time');
  }


  /**
   * Executes code before component unmounts
   */
  componentWillUnmount = () => {
    // remove all document-level event listeners
    // handled by the component
    document.removeEventListener('copy', this.onCopy);
    document.removeEventListener('cut', this.onCopy);
    document.removeEventListener('paste', this.onPaste);
  }

  makeAssets = (props) => {
    const {
      story: {
        contextualizations,
        resources,
        contextualizers,
      },
      // activeComposition
    } = props;
    /*
     * Resource Assets preparation
     */
    const assets = Object.keys(contextualizations)
    .reduce((ass, id) => {
      const contextualization = contextualizations[id];
      const contextualizer = contextualizers[contextualization.contextualizerId];
      return {
        ...ass,
        [id]: {
          ...contextualization,
          resource: resources[contextualization.resourceId],
          contextualizer,
          type: contextualizer ? contextualizer.type : INLINE_ASSET
        }
      };
    }, {});
    return assets;
  }

  makeCitationData = (props, assets) => {
    const {
      story: {
        contextualizations,
        resources,
        contextualizers,
      },
      activeComposition
    } = props;

    /*
     * Citations preparation
     */
    // isolate bib contextualizations
    const bibContextualizations = Object.keys(assets)
    .map(assetKey => assets[assetKey])
    .filter(asset => {
      return asset.type === 'bib' && asset.compositionId === activeComposition.id;
    });

    // build citations items data
    // with all assets except glossary
    const citationItems = Object.keys(assets)
      .filter(id =>
          assets[id].resource.metadata.type !== 'glossary' &&
          assets[id].compositionId === activeComposition.id
        )
      .reduce((finalCitations, key1) => {
        const asset = assets[key1];
        const citations = resourceToCslJSON(asset.resource);
        // const citations = bibCit.resource.data;
        const newCitations = citations.reduce((final2, citation) => {
          return {
            ...final2,
            [citation.id]: citation
          };
        }, {});
        return {
          ...finalCitations,
          ...newCitations,
        };
      }, {});

    // build citations's citations data
    const citationInstances = bibContextualizations // Object.keys(bibContextualizations)
      .map((bibCit, index) => {
        const key1 = bibCit.id;
        const contextualization = contextualizations[key1];

        const contextualizer = contextualizers[contextualization.contextualizerId];
        const resource = resources[contextualization.resourceId];
        return {
          citationID: key1,
          citationItems: resourceToCslJSON(resource).map(ref => ({
            locator: contextualizer.locator,
            prefix: contextualizer.prefix,
            suffix: contextualizer.suffix,
            // ...contextualizer,
            id: ref.id,
          })),
          properties: {
            noteIndex: index + 1
          }
        };
      });
    // map them to the clumsy formatting needed by citeProc
    // todo: refactor the citationInstances --> citeProc-formatted data as a util
    const citationData = citationInstances.map((instance, index) => [
      instance,
      // citations before
      citationInstances.slice(0, (index === 0 ? 0 : index))
        .map((oCitation) => [
            oCitation.citationID,
            oCitation.properties.noteIndex
          ]
        ),
      []
      // citations after (not using it seems to work anyway)
      // citationInstances.slice(index)
      //   .map((oCitation) => [
      //       oCitation.citationID,
      //       oCitation.properties.noteIndex
      //     ]
      //   ),
    ]);

    return {
      citationData,
      citationItems,
      assets
    };
  }


  /**
   * Prepares data within component's state for later pasting
   * @param {event} e - the copy event
   */
  onCopy = e => {
    // ensuring user is editing the contents
    if (!this.props.editorFocus) {
      return;
    }
    // we store entities data as a js object in order to reinject them in editor states later one
    const copiedEntities = {};
    const copiedNotes = [];
    const copiedContextualizers = [];
    const copiedContextualizations = [];

    let clipboard = null;
    let editorState;
    // we will store all state modifications in this object
    // and apply all at once then
    const stateDiff = {};

    const {
      editorFocus,
      activeComposition,
      editorStates,
      activeStory
    } = this.props;
    const {
      contextualizations,
      contextualizers,
      // resources
    } = activeStory;

    // first step is to retrieve draft-made clipboard ImmutableRecord
    // and proper editor state (wether copy event comes from a note or the main content)
    // case 1: data is copied from the main editor
    if (editorFocus === 'main') {
      clipboard = this.editor.mainEditor.editor.getClipboard();
      editorState = editorStates[activeComposition.id];
    // case 2: data is copied from a note
    }
    else {
      editorState = editorStates[editorFocus];
      clipboard = this.editor.notes[editorFocus].editor.editor.getClipboard();
    }
    // bootstrapping the list of copied entities accross editors
    copiedEntities[editorFocus] = [];
    const currentContent = editorState.getCurrentContent();
    // this function comes from draft-js-utils - it returns
    // a fragment of content state that correspond to currently selected text
    const selectedBlocksList = getSelectedBlocksList(editorState);

    stateDiff.clipboard = clipboard;

    // we are going to parse draft-js ContentBlock objects
    // and store separately non-textual objects that needs to be remembered
    // (entities, notes, inline assets, block assets)
    selectedBlocksList.forEach(contentBlock => {
      const block = contentBlock.toJS();
      const entitiesIds = block.characterList.filter(char => char.entity).map(char => char.entity);
      let entity;
      let eData;
      entitiesIds.forEach(entityKey => {
        entity = currentContent.getEntity(entityKey);
        eData = entity.toJS();
        // draft-js entities are stored separately
        // because we will have to re-manipulate them (ie. attribute a new target id)
        // when pasting later on
        copiedEntities[editorFocus].push({
          key: entityKey,
          entity: eData
        });
        const type = eData.type;
        // copying note pointer and related note
        if (type === NOTE_POINTER) {
          const noteId = eData.data.noteId;
          const noteContent = editorStates[noteId].getCurrentContent();
          // note content is storied as a raw representation
          const rawContent = convertToRaw(noteContent);
          copiedEntities[noteId] = [];
          copiedNotes.push({
            id: noteId,
            rawContent
          });
          // copying note's entities
          noteContent.getBlockMap().forEach(thatBlock => {
            thatBlock.getCharacterList().map(char => {
              // copying note's entity and related contextualizations
              if (char.entity) {
                entityKey = char.entity;
                entity = currentContent.getEntity(entityKey);
                eData = entity.toJS();
                copiedEntities[noteId].push({
                  key: entityKey,
                  entity: eData
                });
                copiedContextualizations.push({
                  ...contextualizations[eData.data.asset.id]
                });
              }
            });
            return true;
          });
        }
        // copying asset entities and related contextualization & contextualizer
        // todo: question - should we store as well the resources being copied ?
        // (in case the resource being copied is deleted by the time)
        else {
          const assetId = entity.data.asset.id;
          const contextualization = contextualizations[assetId];
          copiedContextualizations.push({...contextualization});
          copiedContextualizers.push({
            ...contextualizers[contextualization.contextualizerId],
            id: contextualization.contextualizerId
          });
        }
      });
      return true;
    });

    // this object stores all the stuff we need to paste content later on
    const copiedData = {
      copiedEntities,
      copiedContextualizations,
      copiedContextualizers,
      copiedNotes
    };

    e.clipboardData.setData('text/plain', SCHOLAR_DRAFT_CLIPBOARD_CODE);
    stateDiff.copiedData = copiedData;
    this.setState(stateDiff);/* eslint react/no-set-state:0 */
    e.preventDefault();
  }


  /**
   * Handles pasting command in the editor
   * @param {event} e - the copy event
   */
  onPaste = e => {
    // ensuring this is happening while editing the content
    if (!this.props.editorFocus) {
      return;
    }

    const {
      activeStoryId,
      editorFocus,
      activeComposition,
      editorStates,
      createContextualization,
      createContextualizer,
      // createResource,
      updateDraftEditorsStates,
      updateComposition,
    } = this.props;

    const {
      notes
    } = activeComposition;

    const activeCompositionId = activeComposition.id;

    const {
      clipboard, // blockMap of the data copied to clipboard
      copiedData, // model-dependent set of data objects saved to clipboard
    } = this.state;

    // this hack allows to check if data comes from outside of the editor
    // case 1 : comes from outside
    if (!clipboard || e.clipboardData.getData('text/plain') !== SCHOLAR_DRAFT_CLIPBOARD_CODE) {
      // clear components "internal clipboard" and let the event happen
      // normally (it is in this case draft-js which will handle the paste process)
      // as a editorChange event (will handle clipboard content as text or html)
      this.setState({/* eslint react/no-set-state:0 */
        clipboard: null,
        copiedData: null
      });
      return;
    }
    else {
      // if contents comes from scholar-draft, prevent default
      // because we are going to handle the paste process manually
      e.preventDefault();
    }

    // let editorState;
    let newNotes;
    let newClipboard = clipboard;// clipboard entities will have to be updated


    // case: some non-textual data has been saved to the clipboard
    if (typeof copiedData === 'object') {
        const data = copiedData;
        // past assets/contextualizations (attributing them a new id)
        if (data.copiedContextualizations) {
          data.copiedContextualizations.forEach(contextualization => {
            createContextualization(activeStoryId, contextualization.id, contextualization);
          });
        }
        // past contextualizers (attributing them a new id)
        if (data.copiedContextualizers) {
          data.copiedContextualizers.forEach(contextualizer => {
            createContextualizer(activeStoryId, contextualizer.id, contextualizer);
          });
        }
        // paste notes (attributing them a new id to duplicate them if in situation of copy/paste)
        if (data.copiedNotes && editorFocus === 'main') {
          // we have to convert existing notes contents
          // as EditorState objects to handle past and new notes
          // the same way
          const pastNotes = Object.keys(notes).reduce((result, noteId) => {
            return {
              ...result,
              [noteId]: {
                ...notes[noteId],
                contents: EditorState.createWithContent(convertFromRaw(notes[noteId].contents), this.editor.mainEditor.createDecorator()),
              }
            };
          }, {});
          // now we attribute to new notes a new id (to handle possible duplicates)
          // and merge them with the past notes
          newNotes = data.copiedNotes.reduce((result, note) => {
            const id = generateId();
            const noteEditorState = EditorState.createWithContent(convertFromRaw(note.rawContent), this.editor.mainEditor.createDecorator());
            return {
              ...result,
              [id]: {
                ...note,
                contents: noteEditorState,
                oldId: note.id,
                id
              }
            };
          }, {
            ...pastNotes
          });

          // we now have to update copied entities targets
          // for entities stored in pasted notes
          data.copiedEntities = Object.keys(data.copiedEntities)
          // reminder : copiedEntities is a map of editors (main + notes)
          // that have been copied.
          // We therefore iterate in this map
          .reduce((result, id) => {
            // we are interested in updating only the entities in the main
            // because it is only there that there are note pointers entities
            if (id !== 'main') {
              // looking for note pointers that were attached
              // to the original copied note in order to update them
              // with the newly given note id
              const noteId = Object.keys(newNotes)
                .find(thatNoteId => {
                  const note = newNotes[thatNoteId];
                  return note.oldId === id;
                });
              // if the target note is a "ghost" one
              // (i.e. linked to an old note id), attribute correct id
              if (noteId && newNotes[noteId].oldId) {
                // console.info('reattributing entity to note id', newNotes[noteId].id);
                return {
                  ...result,
                  [newNotes[noteId].id]: data.copiedEntities[newNotes[noteId].oldId]
                };
              }
            }
            return {
              ...result,
              [id]: data.copiedEntities[id]
            };
          }, {});
        }
        else {
          newNotes = notes;
        }

        // integrate new draftjs entities in respective editorStates
        // editorStates as stored as a map in which each keys corresponds
        // to a category of content ('main' + uuids for each note)
        if (Object.keys(data.copiedEntities).length) {
          // update entities data with correct notes and contextualizations ids pointers
          const copiedEntities = Object.keys(data.copiedEntities).reduce((result, contentId) => {
            return {
              ...result,
              [contentId]: data.copiedEntities[contentId].map(inputEntity => {
                const entity = {...inputEntity};
                const thatData = entity.entity.data;
                // case: copying note entity
                if (thatData && data.noteId) {
                  const id = Object.keys(newNotes).find(key => {
                    if (newNotes[key].oldId === data.noteId) {
                      return true;
                    }
                  });
                  if (id) {
                    // attributing new id
                    return {
                      ...entity,
                      entity: {
                        ...entity.entity,
                        data: {
                          ...thatData,
                          noteId: id
                        }
                      }
                    };
                  }
                }
                // case: copying asset entity
                else if (data.asset && data.asset.id) {
                  const id = Object.keys(copiedData.copiedContextualizations).find(key => {
                    if (copiedData.copiedContextualizations[key].oldId === data.asset.id) {
                      return true;
                    }
                  });
                  if (id) {
                    return {
                      ...entity,
                      entity: {
                        ...entity.entity,
                        data: {
                          ...entity.entity.data,
                          asset: {
                            ...entity.entity.data.asset,
                            oldId: entity.entity.data.asset.id,
                            id
                          }
                        }
                      }
                    };
                  }
                }
                return entity;
              })
            };
          }, {});

          let newContentState;

          // iterating through all the entities and adding them to the new editor state
          Object.keys(copiedEntities).forEach(contentId => {
            if (contentId === 'main') {
              // iterating through the main editor's copied entities
              copiedEntities[contentId].forEach(entity => {
                const editor = editorStates[activeCompositionId];
                newContentState = editor.getCurrentContent();
                newContentState = newContentState.createEntity(entity.entity.type, entity.entity.mutability, {...entity.entity.data});
                // const newEditorState = EditorState.push(
                //   editor,
                //   newContentState,
                //   'create-entity'
                // );
                const newEntityKey = newContentState.getLastCreatedEntityKey();
                // updating the related clipboard
                newClipboard = newClipboard.map(block => {
                  const characters = block.getCharacterList();
                  const newCharacters = characters.map(char => {
                    if (char.getEntity() && char.getEntity() === entity.key) {
                      return CharacterMetadata.applyEntity(char, newEntityKey);
                    }
                    return char;
                  });
                  return block.set('characterList', newCharacters); // block;
                });
              });
            }
            // iterating through a note's editor's copied entities
            else {
              copiedEntities[contentId].forEach(entity => {
                const editor = newNotes[contentId].contents;

                newContentState = editor.getCurrentContent();
                newContentState = newContentState.createEntity(entity.entity.type, entity.entity.mutability, {...entity.entity.data});
                // update related entity in content
                newContentState.getBlockMap().map(block => {
                  block.getCharacterList().map(char => {
                    if (char.getEntity()) {
                      const ent = newContentState.getEntity(char.getEntity());
                      const eData = ent.getData();
                      if (eData.asset && eData.asset.id && eData.asset.id === entity.entity.data.asset.oldId) {
                        newContentState = newContentState.mergeEntityData(char.getEntity(), {
                          ...entity.entity.data
                        });
                      }
                    }
                  });
                });
                newNotes[contentId].contents = EditorState.push(
                  editor,
                  newContentState,
                  'create-entity'
                );
                const newEntityKey = newContentState.getLastCreatedEntityKey();
                newClipboard = newClipboard.map(block => {
                  const characters = block.getCharacterList();
                  const newCharacters = characters.map(char => {
                    if (char.getEntity() && char.getEntity() === entity.key) {
                      return CharacterMetadata.applyEntity(char, newEntityKey);
                    }
                    return char;
                  });
                  return block.set('characterList', newCharacters); // block;
                });
              });
            }
          });
        }
    }


    let mainEditorState = editorStates[activeCompositionId];
    let notesOrder;
    // case pasting target is the main editor
    if (editorFocus === 'main') {
      mainEditorState = insertFragment(mainEditorState, newClipboard);
      const {newNotes: newNewNotes, notesOrder: newNotesOrder} = updateNotesFromEditor(mainEditorState, newNotes);
      newNotes = newNewNotes;
      notesOrder = newNotesOrder;
    }
    // case pasting target is a note editor
    else {
      newNotes = {
        ...Object.keys(newNotes).reduce((convertedNotes, noteId) => {
          const note = newNotes[noteId];
          return {
            ...convertedNotes,
            [noteId]: {
              ...note,
              contents: editorStates[noteId],
            }
          };
        }, {}),
        [editorFocus]: {
          ...newNotes[editorFocus],
          contents: insertFragment(
            EditorState.createWithContent(
              convertFromRaw(newNotes[editorFocus].contents),
              this.editor.mainEditor.createDecorator()
            ),
            newClipboard
          )
        }
      };
    }

    newNotes = Object.keys(newNotes).reduce((result, noteId) => {
      const note = newNotes[noteId];
      delete note.oldId;
      return {
        ...result,
        [noteId]: note
      };
    }, {});

    // all done ! now we batch-update all the editor states ...
    const newEditorStates = Object.keys(newNotes).reduce((editors, noteId) => {
      return {
        ...editors,
        [noteId]: newNotes[noteId].contents
      };
    }, {[activeCompositionId]: mainEditorState});

    updateDraftEditorsStates(newEditorStates);

    // ...then update the composition with editorStates convert to serializable raw objects
    const newComposition = {
      ...activeComposition,
      contents: convertToRaw(mainEditorState.getCurrentContent()),
      notesOrder,
      notes: Object.keys(newNotes).reduce((result, noteId) => {
        return {
          ...result,
          [noteId]: {
            ...newNotes[noteId],
            contents: convertToRaw(newNotes[noteId].contents.getCurrentContent())
          }
        };
      }, {})
    };
    updateComposition(activeStoryId, activeCompositionId, newComposition);
  }


  /**
   * Monitors operations that look into the editor state
   * to see if contextualizations and notes have to be updated/delete
   * (this operation is very expensive in performance and should
   * always be wrapped in a debounce)
   */
  cleanStuffFromEditorInspection = () => {
    if (!this.state.locked) {
      this.updateContextualizationsFromEditor(this.props);
      this.updateNotesFromEditor(this.props);
    }
  }


  /**
   * Deletes contextualizations that are not any more linked
   * to an entity in the editor.
   * @param {object} props - properties to use
   */
  updateContextualizationsFromEditor = props => {
    const {
      activeComposition,
      editorStates,
      deleteContextualization,
      // compositionId,
      activeStoryId,
      story
    } = props;
    const activeCompositionId = activeComposition.id;
    // regroup all eligible editorStates
    const notesEditorStates = Object.keys(activeComposition.notes).reduce((result, noteId) => {
      return {
        ...result,
        [noteId]: editorStates[noteId]
      };
    }, {});
    // regroup all eligible contextualizations
    const compositionContextualizations = Object.keys(story.contextualizations)
      .filter(id => {
        return story.contextualizations[id].compositionId === activeCompositionId;
      })
      .reduce((final, id) => ({
        ...final,
        [id]: story.contextualizations[id],
      }), {});

    // look for used contextualizations in main
    let used = getUsedAssets(editorStates[activeCompositionId], compositionContextualizations);
    // look for used contextualizations in notes
    Object.keys(notesEditorStates)
    .forEach(noteId => {
      const noteEditor = notesEditorStates[noteId];
      used = used.concat(getUsedAssets(noteEditor, compositionContextualizations));
    });
    // compare list of contextualizations with list of used contextualizations
    // to track all unused contextualizations
    const unusedAssets = Object.keys(compositionContextualizations).filter(id => used.indexOf(id) === -1);
    // delete contextualizations
    unusedAssets.forEach(id => {
      deleteContextualization(activeStoryId, id);
    });
  }

  /**
   * Deletes notes that are not any more linked
   * to an entity in the editor
   * and update notes numbers if their order has changed.
   * @param {object} props - properties to use
   */
  updateNotesFromEditor = (props) => {
    const {
      editorStates,
      compositionId,
      activeStoryId,
      activeComposition,
      updateComposition,
    } = props;
    const {newNotes, notesOrder} = updateNotesFromEditor(editorStates[compositionId], activeComposition.notes);
    const newComposition = activeComposition;
    newComposition.notes = newNotes;
    newComposition.notesOrder = notesOrder;
    if (newNotes !== activeComposition.notes) {
      updateComposition(activeStoryId, compositionId, newComposition);
    }
  }

  deleteNote = id => {
    const {
      editorStates,
      activeComposition,
      compositionId,
      activeStoryId,

      updateComposition,
      updateDraftEditorState,
      setEditorFocus,
    } = this.props;
    const mainEditorState = editorStates[compositionId];
    // remove related entity in main editor
    deleteNoteFromEditor(mainEditorState, id, newEditorState => {
      // remove note
      const notes = activeComposition.notes;
      delete notes[id];
      // update composition
      updateComposition(activeStoryId, compositionId, {
        ...activeComposition,
        contents: convertToRaw(newEditorState.getCurrentContent()),
        notes
      });
      // update editor
      updateDraftEditorState(compositionId, newEditorState);
      updateDraftEditorState(id, undefined);
      // focus on main editor
      setEditorFocus(compositionId);
    });
    this.editor.focus('main');
  }


  /**
   * Adds an empty note to the editor state
   */
  addNote = () => {
    const {
      editorStates,
      activeStoryId,
      activeComposition,
      compositionId,
    } = this.props;

    const id = generateId();
    // add related entity in main editor
    const mainEditorState = insertNoteInEditor(editorStates[compositionId], id);
    // prepare notes with immutable editorState
    const activeNotes = Object.keys(activeComposition.notes).reduce((fNotes, nd) => ({
      ...fNotes,
      [nd]: {
        ...activeComposition.notes[nd],
        contents: EditorState.createWithContent(
            convertFromRaw(activeComposition.notes[nd].contents),
            this.editor.mainEditor.createDecorator()
          )
      }
    }), {});
    // add note
    let notes = {
      ...activeNotes,
      [id]: {
        id,
        contents: this.editor.generateEmptyEditor()
      }
    };
    const {newNotes, notesOrder} = updateNotesFromEditor(mainEditorState, notes);
    notes = newNotes;
    const newComposition = {
      ...activeComposition,
      notesOrder,
      contents: convertToRaw(mainEditorState.getCurrentContent()),
      notes: Object.keys(notes).reduce((fNotes, nd) => ({
        ...fNotes,
        [nd]: {
          ...notes[nd],
          contents: notes[nd].contents ? convertToRaw(notes[nd].contents.getCurrentContent()) : this.editor.generateEmptyEditor()
        }
      }), {})
    };
    const newEditors = Object.keys(notes).reduce((fEditors, nd) => ({
      ...fEditors,
      [nd]: notes[nd].contents
    }), {
      [compositionId]: mainEditorState
    });
    // update contents
    this.props.updateComposition(activeStoryId, compositionId, newComposition);
    // update editors
    this.props.updateDraftEditorsStates(newEditors);
    // update focus
    // focus on new note
    this.props.setEditorFocus(undefined);
    setTimeout(() => {
      this.props.setEditorFocus(id);
      this.editor.focus(id);
    });
  }


  /**
   * Add plain text in one of the editor states (main or note)
   * @param {string} text - text to add
   * @param {string} contentId - 'main' or noteId
   */
  addTextAtCurrentSelection = (text, contentId) => {
    const {
      activeComposition,
      activeStoryId,
      compositionId,
      editorStates,
      updateDraftEditorState,
      updateComposition,
    } = this.props;
    const editorState = contentId === 'main' ? editorStates[compositionId] : editorStates[contentId];
    const editorStateId = contentId === 'main' ? compositionId : contentId;
    const newContentState = Modifier.insertText(
      editorState.getCurrentContent(),
      editorState.getSelection(),
      text,
    );
    let newComposition;
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      'insert-text'
    );
    updateDraftEditorState(editorStateId, newEditorState);
    if (contentId === 'main') {
      newComposition = {
        ...activeComposition,
        contents: convertToRaw(newEditorState.getCurrentContent())
      };
    }
    else {
      newComposition = {
        ...activeComposition,
        notes: {
          ...activeComposition.notes,
          [contentId]: {
            ...activeComposition.notes[contentId],
            contents: convertToRaw(newEditorState.getCurrentContent())
          }
        }
      };
    }
    updateComposition(activeStoryId, compositionId, newComposition);
  }


  /**
   * Handle changes on contextualizers or resources
   * from within the editor
   * @param {string} dataType - the type of collection where the object to update is located
   * @param {string} dataId - the id of the object
   * @param {object} data - the new data to apply to the object
   */
  onDataChange = (dataType, dataId, data) => {
    const {
      updateResource,
      updateContextualizer,
      updateContextualization,
      activeStoryId
    } = this.props;
    if (dataType === 'resource') {
      updateResource(activeStoryId, dataId, data);
    }
    else if (dataType === 'contextualizer') {
      updateContextualizer(activeStoryId, dataId, data);
    }
 else if (dataType === 'contextualization') {
      updateContextualization(activeStoryId, dataId, data);
    }
  }

  onAssetBlur = () => {
    // console.log('on asset blur');
  }

  onAssetFocus = () => {
    // console.log('on asset focus');
  }


  /**
   * Callbacks when an asset is requested
   * @param {string} contentId - the id of the target editor ('main' or noteId)
   * @param {ImmutableRecord} inputSelection - the selection to request the asset at
   */
  onAssetRequest = (contentId, inputSelection) => {
    const {
      setEditorFocus,
      requestAsset,
      editorStates,
      // editorFocus,
    } = this.props;

    const editorId = contentId === 'main' ? this.props.compositionId : contentId;
    const selection = inputSelection || editorStates[editorId].getSelection();

    setEditorFocus(contentId);
    this.editor.focus(contentId);
    // register assetRequestState
    requestAsset(editorId, selection);
  }

  hydrateEditorStates = (activeComposition) => {
    const editors = Object.keys(activeComposition.notes || {})
        // notes' editor states hydratation
        .reduce((eds, noteId) => ({
          ...eds,
          [noteId]: activeComposition.notes[noteId].contents && activeComposition.notes[noteId].contents.entityMap ?
          EditorState.createWithContent(
            convertFromRaw(activeComposition.notes[noteId].contents),
            this.editor.mainEditor.createDecorator()
          )
          : this.editor.generateEmptyEditor()
        }),
        // main editor state hydratation
        {
          [activeComposition.id]: activeComposition.contents && activeComposition.contents.entityMap ?
            EditorState.createWithContent(
              convertFromRaw(activeComposition.contents),
              this.editor.mainEditor.createDecorator()
            )
            : this.editor.generateEmptyEditor()
        });
    this.props.updateDraftEditorsStates(editors);
  }

  updateCompositionRawContent = (editorStateId, storyId, compositionId) => {
    // preventing intempestuous updates
    if (compositionId !== this.props.compositionId || this.state.locked) {
      return;
    }
    const composition = this.props.story.compositions[compositionId];

    const finalEditorStateId = editorStateId === 'main' ? compositionId : editorStateId;
    const finalEditorState = this.props.editorStates[finalEditorStateId];
    // as the function is debounced it would be possible
    // not to have access to the final editor state
    if (!finalEditorState) {
      return;
    }
    const rawContent = convertToRaw(finalEditorState.getCurrentContent());


    let newComposition;
    // this.props.update(this.state.editorState);
    if (editorStateId === 'main') {
      newComposition = {
        ...composition,
        contents: rawContent
      };
    }
    else {
      newComposition = {
        ...composition,
        notes: {
          ...composition.notes,
          [editorStateId]: {
            ...composition.notes[editorStateId],
            contents: rawContent
          }
        }
      };
    }

    this.props.updateComposition(storyId, compositionId, newComposition);
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      addNote,
      deleteNote,
      updateCompositionRawContentDebounced,
      onAssetRequest,
      onAssetFocus,
      onAssetBlur,
      addTextAtCurrentSelection,
      onDataChange,
      state,
      props
    } = this;
    const {
      story,
      activeComposition,
      compositionId,
      activeStoryId,
      updateComposition,
      editorStates,
      editorFocus,
      setEditorFocus,
      updateDraftEditorState,
      assetRequestPosition,
      cancelAssetRequest,
      summonAsset,
      setAssetEmbedType,
      assetEmbedType,
    } = props;

    const {
      clipboard,
      citationData,
      citationItems,
      assets
    } = state;

    if (!story || !activeComposition) {
      return null;
    }

    const {
      // contextualizers,
      // contextualizations,
      resources,
    } = story;


    const {
      notes: inputNotes
    } = activeComposition;

    const t = this.context.t;


    const mainEditorState = editorStates[compositionId]; // || this.editor.generateEmptyEditor();
    // replacing notes with dynamic non-serializable editor states
    const notes = inputNotes ? Object.keys(inputNotes).reduce((no, id) => ({
      ...no,
      [id]: {
        ...inputNotes[id],
        contents: editorStates[id]
      }
    }), {}) : {};

    // let clipboard;
    const focusedEditorId = editorFocus;


    /**
     * Callbacks
     */
    // the following callbacks are not used for now but available
    // const onAssetClick = () => console.log('on asset click');
    // const onAssetMouseOver = () => console.log('onAssetMouseOver');
    // const onAssetMouseOut = () => console.log('onAssetMouseOut');

    // const onNotePointerMouseOver = () => console.log('onNotePointerMouseOver');
    // const onNotePointerMouseOut = () => console.log('onNotePointerMouseOut');
    // const onNotePointerMouseClick = () => console.log('onNotePointerMouseClick');

    // used callbacks
    const onAssetChoice = (option, contentId) => {
      const id = option.metadata.id || option.id;
      let targetedEditorId = contentId;
      if (!targetedEditorId) {
        targetedEditorId = this.props.editorFocus;
      }
      cancelAssetRequest();
      summonAsset(targetedEditorId, id);
      setTimeout(() => {
        setEditorFocus(targetedEditorId);
        this.editor.focus(targetedEditorId);
      }, timers.short);
    };

    const onEditorChange = (editorId, editor) => {
      const editorStateId = editorId === 'main' ? compositionId : editorId;
      // update active immutable editor state
      updateDraftEditorState(editorStateId, editor);
      // ("debouncily") update serialized content
      updateCompositionRawContentDebounced(editorId, activeStoryId, compositionId);
    };

    const onActiveCompositionTitleChange = e => {
      const title = e.target.value;
      e.stopPropagation();
      e.preventDefault();
      const newActiveComposition = {
        ...activeComposition,
        metadata: {
          ...activeComposition.metadata,
          title
        }
      };
      updateComposition(activeStoryId, compositionId, newActiveComposition);
    };

    const onDrop = (contentId, payload, selection) => {
      if (payload && payload.indexOf('DRAFTJS_RESOURCE_ID:') > -1) {
        const id = payload.split('DRAFTJS_RESOURCE_ID:')[1];
        let targetedEditorId = contentId;
        if (!targetedEditorId) {
          targetedEditorId = this.props.editorFocus;
        }
        const editorId = contentId === 'main' ? activeComposition.id : contentId;
        const editorState = editorStates[editorId];
        updateDraftEditorState(editorId, EditorState.forceSelection(editorState, selection));
        onAssetChoice({metadata: {id}}, contentId, assetEmbedType);
      }
    };

    const onDragOver = (contentId) => {
      if (focusedEditorId !== contentId) {
        setEditorFocus(contentId);
        this.editor.focus(contentId);
      }
    };
    const onClick = (event, contentId = 'main') => {
      if (focusedEditorId !== contentId) {
        setEditorFocus(contentId);
      }
    };

    const onBlur = (event, contentId = 'main') => {
      event.stopPropagation();
      // if focus has not be retaken by another editor
      // after a timeout, blur the whole editor
      // "- be my guest ! - no, you first ! - thank you madame."
      setTimeout(() => {
        if (focusedEditorId === contentId && !assetRequestPosition) {
          setEditorFocus(undefined);
        }
      });
    };

    const onScroll = () => {
      if (focusedEditorId === 'main') {
        this.editor.mainEditor.updateSelection();
      }
      else if (focusedEditorId && this.editor.notes[focusedEditorId]) {
        this.editor.notes[focusedEditorId].editor.updateSelection();
      }
    };
    const onTitleInputClick = e => {
      e.stopPropagation();
    };

    const onAssetRequestCancel = () => {
      cancelAssetRequest();
      setTimeout(() => {
        setEditorFocus(focusedEditorId);
        this.editor.focus(focusedEditorId);
      }, timers.short);
    };

    const assetChoiceProps = {
      activeMode: assetEmbedType,
      setActiveMode: mode => setAssetEmbedType(mode),
      options: {
        resources: Object.keys(resources).map(key => resources[key]),
        compositions: Object.keys(this.props.story.compositions).map(key => this.props.story.compositions[key])
      },
      addPlainText: (text, contentId) => {
        addTextAtCurrentSelection(text, contentId);
        onAssetRequestCancel();
        setTimeout(() => {
          setEditorFocus(contentId);
        });
      }
    };

    const onCompositionTitleClick = () => {
      // because of editor's focus management,
      // focus has to be forced
      setTimeout(() => this.compositionTitle.focus());
    };

    /*
     * References binding
     */
    const bindRef = editor => {
      this.editor = editor;
    };
    const bindCompositionTitle = compositionTitle => {
      this.compositionTitle = compositionTitle;
    };

    // define citation style and locales, falling back on defaults if needed
    const style = (story &&
                          story.settings &&
                          story.settings.citationStyle &&
                          story.settings.citationStyle.data
                        )
                          || defaultStyle;
    const locale = (story &&
                          story.settings &&
                          story.settings.citationLocale &&
                          story.settings.citationLocale.data
                        )
                          || defaultLocale;


    return (
      <div className="plurishing-backoffice-CompositionEditor">
        <h1 className="editable-title" onClick={onTitleInputClick}>
          <input
            type="text"
            ref={bindCompositionTitle}
            onClick={onCompositionTitleClick}
            value={activeComposition.metadata.title || ''}
            onChange={onActiveCompositionTitleChange}
            placeholder={t('composition-title')} />
        </h1>
        <div className="editor-wrapper" onScroll={onScroll}>
          <ReferencesManager
            style={style}
            locale={locale}
            items={citationItems}
            citations={citationData}>
            <Editor
              mainEditorState={mainEditorState}
              notes={notes}
              assets={assets}

              BibliographyComponent={Object.keys(citationItems).length > 0 ? () => <Bibliography /> : null}

              clipboard={clipboard}

              ref={bindRef}

              focusedEditorId={focusedEditorId}

              onEditorChange={onEditorChange}

              onDrop={onDrop}
              onDragOver={onDragOver}
              onClick={onClick}
              onBlur={onBlur}

              onAssetRequest={onAssetRequest}
              onAssetFocus={onAssetFocus}
              onAssetBlur={onAssetBlur}
              onAssetChange={onDataChange}
              onAssetRequestCancel={onAssetRequestCancel}
              onAssetChoice={onAssetChoice}

              onNoteAdd={addNote}
              onNoteDelete={deleteNote}

              assetRequestPosition={assetRequestPosition}
              assetChoiceProps={assetChoiceProps}

              inlineAssetComponents={inlineAssetComponents}
              blockAssetComponents={blockAssetComponents}
              AssetChoiceComponent={ContextualizationWidget}
              inlineEntities={[/*{
                strategy: compositionLinkStrategy.bind(this),
                component: CompositionLink
              }*/]} />

          </ReferencesManager>
        </div>
      </div>
    );
  }
}

/**
 * Component's properties types
 */
CompositionEditor.propTypes = {

  /**
   * active story (needed to access resources and contextualizers
   * which are at story's level)
   */
  story: PropTypes.object,

  /**
   * active story being edited
   */
  activeStoryId: PropTypes.string,

  /**
   * active composition data
   */
  activeComposition: PropTypes.object,

  /**
   * active composition being edited
   */
  compositionId: PropTypes.string,

  /**
   * map of all available draft-js editor states
   */
  editorStates: PropTypes.object,

  /**
   * represents the position of current asset request
   */
  assetRequestPosition: PropTypes.object,

  /**
   * represents the current editor focused in the editor ('main' or noteId)
   */
  editorFocus: PropTypes.string,

  /**
   * callbacks when a whole composition is asked to be updated
   */
  updateComposition: PropTypes.func,

  /**
   * callbacks when focus on a specific editor among main
   * and notes' editors is asked
   */
  setEditorFocus: PropTypes.func,

  /**
   * callbacks when a draft editor has to be updated
   */
  updateDraftEditorState: PropTypes.func,

  /**
   * callbacks when asset request state is cancelled
   */
  cancelAssetRequest: PropTypes.func,

  /**
   * callbacks when an asset insertion is asked
   */
  summonAsset: PropTypes.func,
};

CompositionEditor.childContextTypes = {
  startExistingResourceConfiguration: PropTypes.func,
  lang: PropTypes.string,
};

export default CompositionEditor;
