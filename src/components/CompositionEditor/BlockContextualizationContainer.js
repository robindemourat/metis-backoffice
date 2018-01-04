/**
 * This module provides a reusable block contextualization for the editor component
 * @module plurishing-backoffice/components/SectionEditor
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Textarea from 'react-textarea-autosize';

import AssetPreview from '../AssetPreview/AssetPreview';
// import AsideToggler from '../AsideToggler/AsideToggler';
// import DropZone from '../DropZone/DropZone';
// import CodeEditor from '../CodeEditor/CodeEditor';

// import {
//   fileIsAnImage,
//   loadImage
// } from '../../helpers/assetsUtils';

/**
 * BlockContainer class for building react component instances
 */
class BlockContainer extends Component {


  /**
   * constructor
   * @param {object} props - properties given to instance at instanciation
   */
  constructor(props) {
    super(props);

  }


  /**
   * Defines whether the component should re-render
   * @param {object} nextProps - the props to come
   * @param {object} nextState - the state to come
   * @return {boolean} shouldUpdate - whether to update or not
   */
  shouldComponentUpdate(nextProps) {
    const {
      asset: {
        resource,
        contextualizer,
        legend,
        title
      },
      renderingMode
    } = this.props;
    const {
      asset: {
        resource: nextResource,
        contextualizer: nextContextualizer,
        legend: nextLegend,
        title: nextTitle
      },
      renderingMode: nextRenderingMode
    } = nextProps;
    // return true;
    return (
      resource !== nextResource ||
      contextualizer !== nextContextualizer ||
      legend !== nextLegend ||
      title !== nextTitle ||
      renderingMode !== nextRenderingMode
    );
  }


  /**
   * Renders the component
   * @return {ReactElement} component - the component
   */
  render() {
    const {
      props: {
        asset,
        onAssetChange,
        onAssetFocus,
        onAssetBlur,
        renderingMode,
      },
      context: {
        startExistingResourceConfiguration,
        // lang = 'en',
        t,
      },
    } = this;

    const {
      resource,
      contextualizer,
      ...contextualization
    } = asset;

    // const {
    //   visibility = {
    //     codex: true,
    //     web: true
    //   },
    // } = contextualizer;

    const {
      legend = '',
      title = '',
    } = contextualization;

    const onEditRequest = e => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (typeof startExistingResourceConfiguration === 'function') {
        startExistingResourceConfiguration(resource._id, resource);
      }
    };

    // const setContextualizerType = type => {
    //   onAssetChange('contextualizer', contextualizer.id, {
    //     insertionType: contextualizer.insertionType,
    //     id: contextualizer.id,
    //     previewMode: contextualizer.previewMode,
    //     type,
    //   });
    // };

    // const setContextualizerOption = (key, value) => {
    //   onAssetChange('contextualizer', contextualizer.id, {
    //     ...contextualizer,
    //     [key]: value,
    //   });
    // };

    const onLegendChange = e => {
      const thatLegend = e.target.value;
      onAssetChange('contextualization', contextualization.id, {
        ...contextualization,
        legend: thatLegend,
      });
    };

    const onTitleChange = e => {
      const thatTitle = e.target.value;
      onAssetChange('contextualization', contextualization.id, {
        ...contextualization,
        title: thatTitle,
      });
    };

    const onInputClick = e => {
      onAssetFocus(e);
    };

    // const possibleContextualizersTypes = Object.keys(contextualizers)
    //   .filter(id => {
    //     const lib = contextualizers[id];
    //     const possible = lib && lib.metadata && lib.metadata.model
    //       && lib.metadata.coverage.blockDynamic
    //       && lib.metadata.model.acceptedResourceTypes
    //       && lib.metadata.model.acceptedResourceTypes
    //           .filter(obj => {
    //             if (obj.type) {
    //               return resource.metadata.type === obj.type;
    //             }
    //             else if (obj.test) {
    //               return obj.test(resource);
    //             }
    //           }).length > 0;
    //     return possible === true;
    //   });

    const preventClick = e => {
      e.stopPropagation();
      e.preventDefault();
    };

    return (
      <div className="plurishing-backoffice-BlockContextualizationContainer" onClick={preventClick}>

        <AssetPreview
          type={contextualizer.type}
          data={resource.data}
          metadata={resource.metadata}
          onEditRequest={onEditRequest}
          resource={resource}
          contextualization={contextualization}
          contextualizer={contextualizer}
          renderingMode={renderingMode}
          showPannel />
        <div className="legend-container">
          <input
            value={title}
            onClick={onInputClick}
            onChange={onTitleChange}
            placeholder={t('title-placeholder')}
            onFocus={onAssetFocus}
            onBlur={onAssetBlur} />
          <h3>{t('legend')}</h3>
          <Textarea
            value={legend}
            onClick={onInputClick}
            onChange={onLegendChange}
            placeholder={t('legend-placeholder')}
            onFocus={onAssetFocus}
            onBlur={onAssetBlur} />
        </div>
      </div>
    );
    // return (
    //   <div className="ovide-BlockContextualizationContainer">
    //     <div className="preview-column">
    //       <div
    //         className="preview-body"
    //         onClick={onEditRequest}>
    //         <div className="legend-container">
    //           <input
    //             value={title}
    //             onClick={onInputClick}
    //             onChange={onTitleChange}
    //             placeholder={t('title-placeholder')}
    //             onFocus={onAssetFocus}
    //             onBlur={onAssetBlur} />
    //           <h3>{t('legend')}</h3>
    //           <Textarea
    //             value={legend}
    //             onClick={onInputClick}
    //             onChange={onLegendChange}
    //             placeholder={t('legend-placeholder')}
    //             onFocus={onAssetFocus}
    //             onBlur={onAssetBlur} />
    //         </div>
    //         <AssetPreview
    //           type={contextualizer.type}
    //           data={resource.data}
    //           metadata={resource.metadata}
    //           onEditRequest={onEditRequest}
    //           resource={resource}
    //           contextualization={contextualization}
    //           contextualizer={contextualizer}
    //           previewMode={previewMode}
    //           showPannel />
    //       </div>
    //       <div className="contextualizer-parameters-container">
    //         {
    //               possibleContextualizersTypes.length > 1 &&
    //               <div className="input-group">
    //                 <div className="label">
    //                   {t('set-contextualizer-type')}
    //                 </div>
    //                 <AsideToggler
    //                   options={
    //                   possibleContextualizersTypes.map(id => ({
    //                     id,
    //                     name: id
    //                   }))
    //                 }
    //                   activeOption={contextualizer.type}
    //                   setOption={setContextualizerType} />
    //               </div>
    //             }
    //         <div className="input-group">
    //           <div className="label">
    //             {t('hide-in-codex-mode')}
    //           </div>
    //           <AsideToggler
    //             options={[
    //                   {
    //                     id: true,
    //                     name: t('yes')
    //                   },
    //                   {
    //                     id: false,
    //                     name: t('no')
    //                   }
    //                 ]}
    //             activeOption={!visibility.codex}
    //             setOption={setHideInCodexMode} />
    //         </div>
    //         <div className="input-group">
    //           <div className="label">
    //             {t('hide-in-web-mode')}
    //           </div>
    //           <AsideToggler
    //             options={[
    //                 {
    //                   id: true,
    //                   name: t('yes')
    //                 },
    //                 {
    //                   id: false,
    //                   name: t('no')
    //                 }
    //               ]}
    //             activeOption={!visibility.web}
    //             setOption={setHideInWebMode} />
    //         </div>
    //         {
    //               contextualizers[contextualizer.type]
    //               .metadata
    //               .model
    //               .block
    //               .options &&
    //               contextualizers[contextualizer.type]
    //               .metadata
    //               .model
    //               .block &&
    //               contextualizers[contextualizer.type]
    //               .metadata
    //               .model
    //               .block
    //               .options
    //               .map((option, index) => {
    //                 const onSetOption = opt => {
    //                   setContextualizerOption(option.id, opt);
    //                 };
    //                 const setOptionJsonInput = str => {
    //                   // const str = e.target.value;
    //                   try {
    //                     const obj = JSON.parse(str);
    //                     onAssetChange('contextualizer', contextualizer.id, {
    //                       ...contextualizer,
    //                       [option.id]: obj,
    //                       [option.id + '_temp']: str,
    //                     });
    //                   }
    //                   catch (error) {
    //                     setContextualizerOption(option.id + '_temp', str);
    //                     // console.log('error', error);
    //                   }
    //                 };

    //                 return (
    //                   <div key={index} className="input-group">
    //                     <div className="label">
    //                       {option.title[lang]}
    //                     </div>
    //                     {
    //                       option.type === 'select' &&
    //                       <AsideToggler
    //                         options={
    //                             option.values.map(opt => ({
    //                               id: opt.id,
    //                               name: opt.labels[lang]
    //                             }))
    //                           }
    //                         activeOption={contextualizer[option.id]}
    //                         setOption={onSetOption} />
    //                     }
    //                     {
    //                       option.type === 'boolean' &&
    //                       <AsideToggler
    //                         options={
    //                             [
    //                               {
    //                                 id: true,
    //                                 name: t('yes')
    //                               },
    //                               {
    //                                 id: false,
    //                                 name: t('no')
    //                               },
    //                             ]
    //                           }
    //                         activeOption={contextualizer[option.id]}
    //                         setOption={onSetOption} />
    //                     }
    //                     {
    //                       option.type === 'jsonInput' &&
    //                       <CodeEditor
    //                         value={contextualizer[option.id + '_temp'] || ''}
    //                         onChange={setOptionJsonInput}
    //                         onClick={onInputClick}
    //                         onFocus={onAssetFocus}
    //                         onBlur={onAssetBlur}
    //                         placeholder={option.placeholder[lang]} />
    //                     }
    //                     {
    //                       option.type === 'imageUrl' &&
    //                       <DropZone
    //                         onDrop={setOptionImageDrop}>
    //                         <div>
    //                           <p>{t('drop-a-thumbnail-image-file')}</p>
    //                         </div>
    //                       </DropZone>
    //                     }
    //                   </div>
    //                 );
    //               })
    //             }
    //       </div>
    //     </div>

    //     <div className="preview-footer">
    //       <AsideToggler
    //         options={[
    //           {
    //             id: 'codex',
    //             name: t('preview-in-codex-mode')
    //           },
    //           {
    //             id: 'web',
    //             name: t('preview-in-web-mode')
    //           },
    //         ]}
    //         activeOption={previewMode}
    //         setOption={setPreviewMode} />
    //     </div>
    //   </div>
    // );
  }
}

/**
 * Component's properties types
 */
BlockContainer.propTypes = {
  /*
   * the asset to render
   */
  asset: PropTypes.shape({
    resource: PropTypes.object,
  })
};


/**
 * Component's context used properties
 */
BlockContainer.contextTypes = {

  /**
   * Callbacks when resource configuration is asked from
   * within the asset component
   */
  startExistingResourceConfiguration: PropTypes.func,

  t: PropTypes.func,

  lang: PropTypes.string,

  renderingMode: PropTypes.string,
};
export default BlockContainer;
