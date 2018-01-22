/* eslint react/no-set-state : 0 */
/**
 * This module provides a micropublication preview wrapper component.
 * It is a redux connected component.
 * It ensures proper data is available by launching data request and renders the preview component
 * @module metis-backoffice/components/MicroPublicationPreview
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {get, post} from 'axios';

import {connect} from 'react-redux';
import * as duck from '../../features/Compositions/duck';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {servicesBaseUri, apiBaseUri} = config;


import TwitterPreview from 'metis-shared/dist/components/previews/TwitterPreview/TwitterPreview';
import FacebookPreview from 'metis-shared/dist/components/previews/FacebookPreview/FacebookPreview';
import MailingPreview from 'metis-shared/dist/components/previews/MailingPreview/MailingPreview';

import './MicroPublicationPreview.scss';

import profileImageUri from './assets/profile-placeholder.jpg';

@connect(
  state => ({
    ...duck.selector(state.compositions),
  }),
  dispatch => ({
    actions: bindActionCreators({
      ...duck,
    }, dispatch)
  })
)
export default class MicroPublicationPreview extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);
    const {
      montage: {
        data: {
          target_composition_id: targetCompositionId
        }
      },
      compositions
    } = props;

    this.state = {
      composition: compositions.find(composition => composition._id === targetCompositionId),
      assets: {
        abstractImage: undefined
      }
    };
  }

  componentWillMount() {
    this.updateComposition(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.montage.data.target_composition_id !== nextProps.montage.data.target_composition_id) {
    //   this.updateComposition(nextProps);
    // }

    if (this.props.montage !== nextProps.montage) {
      this.updateComposition(nextProps);
    }

    if (
      nextProps.montage.data.include_abstract && !this.props.montage.data.include_abstract &&
      this.state.composition
    ) {
      this.updateImagesUris(nextProps);
    }
  }

  updateImagesUris = (props) => {
    const abstr = this.state.composition && this.state.composition.metadata.abstract_original;
    const includeAbstract = props.montage.data.include_abstract;
    if (abstr && includeAbstract) {
      const html = `<html>
      <head>
        <style>
          *{background: white; color: black;}
        </style>
      </head>
      <body><p>${abstr}</p></body></html>`;
      const serviceUri = servicesBaseUri + 'html2img';
      post(serviceUri, {data: html})
        .then(data => {
          this.setState({
            assets: {
              ...this.state.assets,
              abstractImageUri: 'data:image/jpg;base64,' + data.data
            }
          });
        })
        .catch();
    }
    if (this.state.assets.abstractImageUri && !includeAbstract) {
      this.setState({
        assets: {
          ...this.state.assets,
          abstractImageUri: undefined
        }
      });
    }
    if (this.props.montage && this.props.montage.data.attached_assets) {
      const toResolve = this.props.montage.data.attached_assets.map(citation => {
        return new Promise((resolve, reject) => {
          const {image_asset_id: imageAssetId} = citation;
          const asset = this.props.assets.find(a => a._id === imageAssetId);
          if (asset) {
            const uri = `${apiBaseUri}assets/${asset._id}/${asset.filename}?encoding=base64`;
            get(uri)
              .then(data => {
                this.setState({
                  assets: {
                    ...this.state.assets,
                    [asset._id]: 'data:image/jpg;base64,' + data.data
                  }
                });
                resolve();
              })
              .catch(reject);
          }
        });
      });
      Promise.all(toResolve);
    }
  }

  updateComposition = (props) => {
    const {
      montage: {
        data: {
          target_composition_id: targetCompositionId
        }
      },
      compositions = []
    } = props;
    let composition = compositions.find(thatComposition => thatComposition._id === targetCompositionId);
    if (composition) {
      this.setState({composition});
      this.updateImagesUris(props);
    }
    else {
      this.props.actions.getComposition(targetCompositionId)
        .then(() => {
          composition = this.props.compositions.find(thatComposition => thatComposition._id === targetCompositionId);
          this.setState({composition});
          this.updateImagesUris(props);
        });
    }
  }

  render() {
    const {
      props: {
        montage,
      },
      state: {
        composition,
        assets
      },
      context: {
        t,
      }
    } = this;
    return (
      <section className="metis-backoffice-MicroPublicationPreview">
        <section className="section">
          <h3 className="title is-4">{t('twitter preview')}</h3>
          {montage && composition ?
            <TwitterPreview
              montage={montage}
              composition={composition}
              assets={assets}
              profileImageUri={profileImageUri} />
           : t('loading')}
        </section>
        <section className="section">
          <h3 className="title is-4">{t('facebook preview')}</h3>
          {montage && composition ?
            <FacebookPreview
              montage={montage}
              composition={composition}
              assets={assets}
              profileImageUri={profileImageUri} />
           : t('loading')}
        </section>
        <section className="section">
          <h3 className="title is-4">{t('mailing preview')}</h3>
          {montage && composition ?
            <MailingPreview
              montage={montage}
              composition={composition}
              assets={assets} />
           : t('loading')}
        </section>
      </section>
    );
  }
}
