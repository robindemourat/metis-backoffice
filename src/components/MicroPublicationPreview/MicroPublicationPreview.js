/* eslint react/no-set-state : 0 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {post} from 'axios';

import {connect} from 'react-redux';
import * as duck from '../../features/Compositions/duck';

import getConfig from '../../helpers/getConfig';
const config = getConfig();
const {servicesBaseUri} = config;


import TwitterPreview from 'plurishing-shared/dist/components/previews/TwitterPreview/TwitterPreview';
import FacebookPreview from 'plurishing-shared/dist/components/previews/FacebookPreview/FacebookPreview';
import MailingPreview from 'plurishing-shared/dist/components/previews/MailingPreview/MailingPreview';


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
    t: PropTypes.func.isRequired
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
    if (this.props.montage.data.target_composition_id !== nextProps.montage.data.target_composition_id) {
      this.updateComposition(nextProps);
    }

    if (
      nextProps.montage.data.include_abstract && !this.props.montage.data.include_abstract
    ) {
      this.updateAbstractImage(nextProps);
    }
  }

  updateAbstractImage = () => {
    const abstr = this.state.composition && this.state.composition.metadata.abstract_original;
    if (abstr) {
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
      this.updateAbstractImage(props);
    }
    else {
      this.props.actions.getComposition(targetCompositionId)
        .then(() => {
          composition = this.props.compositions.find(thatComposition => thatComposition._id === targetCompositionId);
          this.setState({composition});
          this.updateAbstractImage(props);
        });
    }
  }

  render() {
    const {
      props: {
        montage
      },
      state: {
        composition,
        assets
      },
      context: {
        t
      }
    } = this;
    return (
      <section>
        <section>
          <h3>{t('twitter preview')}</h3>
          {montage && composition ?
            <TwitterPreview
              montage={montage}
              composition={composition}
              assets={assets}
              profileImageUri={profileImageUri} />
           : t('loading')}
        </section>
        <section>
          <h3>{t('facebook preview')}</h3>
          {montage && composition ?
            <FacebookPreview
              montage={montage}
              composition={composition}
              assets={assets}
              profileImageUri={profileImageUri} />
           : t('loading')}
        </section>
        <section>
          <h3>{t('mailing preview')}</h3>
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
