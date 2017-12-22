/**
 * A simple preview container simulating dynamic app routing with a state machine
 */

/* eslint react/no-set-state : 0 */

import React, {Component} from 'react';

import CompositionPreview from './CompositionPreview';

export default class PreviewContainer extends Component {

  constructor(props) {
    super(props);

    this.state = {
      location: 'home'
    };
  }

  setLocation = (location, locationId) => {
    this.setState({location, locationId});
  }

  renderView = () => {
    switch (this.state.location) {
      case 'home':
        return (
          <div>
            <h2>Home</h2>
          </div>
        );
      case 'composition':
        const {locationId} = this.state;
        const {
          resources,
          assets,
          montage,
          compositions,
        } = this.props;
        const parameters = montage.data.compositions.find(parameter => parameter.target_composition_id === locationId);
        const composition = compositions[locationId];

        return (
          <CompositionPreview
            parameters={parameters}
            composition={composition}
            resources={resources}
            assets={assets} />
        );

      default:
        return null;
    }
  }

  render() {
    const {
      props: {
        montage,
        compositions,
      },

      setLocation,
      renderView,
    } = this;
    return (
      <section>
        <nav>
          <ul>
            <li>
              <span onClick={() => setLocation('home')}>
                {montage.metadata.title}
              </span>
            </li>
            {
              montage.data.compositions.map((ref, index) => {
                const id = ref.target_composition_id;
                const composition = compositions[id];
                if (!composition) {
                  return null;
                }
                const onClick = () => {
                  setLocation('composition', id);
                };
                return (
                  <li key={index}>
                    <span onClick={onClick}>
                      {composition.metadata.title}
                    </span>
                  </li>
                );
              })
            }
          </ul>
        </nav>
        <section>
          {renderView()}
        </section>
        <style>
          {montage.data.css_code}
        </style>
      </section>
    );
  }
}
