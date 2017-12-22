/**
 * A simple preview container simulating dynamic app routing with a state machine
 */

import React from 'react';

import CompositionPreview from './CompositionPreview';

export default ({
  montage,
  compositions,
  resources,
  assets
}) => {
  return (
    <section>
      <section
        className="cover break-before"
        style={{
            background: montage.data.cover_color
          }}>
        {montage.metadata.title}
      </section>
      <section
        className="index break-before">
        <h2>Sommaire</h2>
        <nav>
          <ul>
            {
                montage.data.compositions.map((ref, index) => {
                  const id = ref.target_composition_id;
                  const composition = compositions[id];
                  if (!composition) {
                    return null;
                  }

                  return (
                    <li key={index}>
                      <a href={'#{composition._id}'}>
                        {composition.metadata.title}
                      </a>
                    </li>
                  );
                })
              }
          </ul>
        </nav>
      </section>
      {
          montage.data.compositions.map((parameters, index) => {
            const composition = compositions[parameters.target_composition_id];
            if (!composition) {
              return null;
            }
            return (<CompositionPreview
              key={index}
              parameters={parameters}
              composition={composition}
              resources={resources}
              assets={assets} />);
          })
        }
      <section className="colophon break-before">
        {
            montage.data.colophon
          }
      </section>
      <style>
        {montage.data.css_code}
      </style>
    </section>
    );
};
