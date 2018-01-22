/* eslint react/no-set-state : 0 */
/**
 * This module provides a dynamic preview wrapper component.
 * It is a redux connected component.
 * It ensures proper data is available by launching data request and renders the preview component
 * @module metis-backoffice/components/DynamicMontagePreview
 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';

import {connect} from 'react-redux';
import * as compositionsDuck from '../../features/Compositions/duck';
import * as assetsDuck from '../../features/Assets/duck';
import * as resourcesDuck from '../../features/Resources/duck';

import PreviewContainer from 'metis-shared/dist/components/previews/DynamicMontagePreview/PreviewContainer';

import './DynamicMontagePreview.scss';
import style from 'metis-shared/dist/components/views/dynamic/styles.scss';/* eslint no-unused-vars: 0*/

@connect(
  state => ({
    ...compositionsDuck.selector(state.compositions),
    ...resourcesDuck.selector(state.resources),
    ...assetsDuck.selector(state.assets),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...compositionsDuck,
      ...resourcesDuck,
      ...assetsDuck,
    }, dispatch)
  })
)
export default class DynamicMontagePreview extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    const {
    } = props;

    this.state = {
      loading: true,
      error: undefined
    };
  }


  componentWillMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.montage !== nextProps.montage) {
      this.fetchData(nextProps);
    }
  }

  fetchData = props => {
    const {
      montage: {
        data: {
          compositions: montageCompositions
        }
      },
      compositions,
      resources,
      assets,
      actions: {
        getComposition,
        getResource,
        getAsset,
      }
    } = props;

    // register all compositions requirements
    const compositionsRequirements = montageCompositions.map(target => target.target_composition_id)
            .filter(id => id);

    // dissociate fetched compositions and others
    const compositionsIdsToFetch = [];
    const availableCompositions = [];
    compositionsRequirements.forEach(id => {
      const existing = compositions.find(thatComp => thatComp._id === id);
      if (existing) {
        availableCompositions.push(existing);
      }
      else {
        compositionsIdsToFetch.push(id);
      }
    });

    // register resources requirement
    const resourcesRequirements = availableCompositions.reduce((result, composition) => {
      return result.concat(composition.resources || []);
    }, []).filter(id => id);

    // dissociate fetched resources and others
    const resourcesIdsToFetch = [];
    const availableResources = [];
    resourcesRequirements.forEach(id => {
      const existing = resources.find(thatResource => thatResource._id === id);
      if (existing) {
        availableResources.push(existing);
      }
      else {
        resourcesIdsToFetch.push(id);
      }
    });

    // register assets requirement
    const assetsRequirements = availableResources.reduce((result, resource) => {
      const assetKeys = Object.keys(resource.data).filter(key => key.indexOf('asset_id') > -1);
      const assetMentions = assetKeys.map(key => resource.data[key]);
      return result.concat(assetMentions || []);
    }, [])
            .filter(id => id);

    // dissociate fetched resources and others
    const assetsIdsToFetch = [];
    const availableAssets = [];
    assetsRequirements.forEach(id => {
      const existing = assets.find(thatAsset => thatAsset._id === id);
      if (existing) {
        availableAssets.push(existing);
      }
      else {
        assetsIdsToFetch.push(id);
      }
    });


    // list all promises
    const toResolve = [
      ...compositionsIdsToFetch.map(id =>
        getComposition(id)
      ),
      ...resourcesIdsToFetch.map(id =>
        getResource(id)
      ),
      ...assetsIdsToFetch.map(id =>
        getAsset(id)
      ),
    ];
    if (toResolve.length) {
      Promise.all(toResolve)
        .then(() => {
          // recursively check for new stuff to fetch
          this.fetchData(this.props);
        })
        .catch(error => {
          this.setState({
            error
          });
        });
    }
     else {
      this.setState({
        loading: false,
        error: undefined,
        compositions: availableCompositions,
        resources: availableResources,
        assets: availableAssets,
      });
    }
  }

  mapify = (collection, key) =>
    collection.reduce((result, item) => ({
      ...result,
      [item[key]]: item
    }), {})

  render() {
    const {
      props: {
        montage,
        getAssetUri,
        citationStyle,
        citationLocale
      },
      state: {
        error,
        loading,
        compositions,
        resources,
        assets,
      },
      context: {
        t
      },
    } = this;
    if (loading) {
      return (
        <section>
          {t('loading')}
        </section>
      );
    }
    if (error) {
      return (
        <section>
          {t('error')}
          {error}
        </section>
      );
    }
    return (
      <div className="metis-backoffice-DynamicMontagePreview">
        <PreviewContainer
          montage={montage}
          compositions={compositions}
          resources={resources}
          assets={assets}
          getAssetUri={getAssetUri}
          citationStyle={citationStyle}
          citationLocale={citationLocale}
          renderingMode="web" />
      </div>
    );
  }
}
