/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the deliverables view
 * @module metis-backoffice/features/Deliverables
 */
import React from 'react';
import PropTypes from 'prop-types';

import './DeliverablesLayout.scss';

import getConfig from '../../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

const DeliverablesLayout = ({
  deliverables = [],
  actions: {
    deleteDeliverable
  }
}, {t}) => (
  <section className="metis-backoffice-Deliverables container is-fluid">
    <section className="section">
      <h1 className="title is-1">{t('Deliverables')}</h1>
    </section>
    <ul className="section">
      {
        deliverables.map((deliverable, index) => {
          const attachmentName = deliverable.filename;
          const deliverableUrl = `${apiBaseUri}deliverables/${deliverable._id}/${attachmentName}`;
          const onDelete = () => {
            deleteDeliverable(deliverable._id);
          };
          return (
            <li
              key={index}
              className="box">
              <article className="media">
                <div className="media-left">
                  <span className="tag">
                    {deliverable.montage_type}
                  </span>
                  {/*<figure className="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
                  </figure>*/}
                </div>
                <div className="media-content">
                  <ul>
                    <li>
                      <h3 className="title is-3">{deliverable.montage_title}</h3>
                    </li>
                    {deliverable.version && <li>
                      {t('version')} : <span className="tag">{deliverable.version}</span>
                    </li>
                    }
                    {deliverable.date_produced && <li>
                      {t('date')} : <span className="tag">{deliverable.date_produced.toString()}</span>
                    </li>}
                    <li>
                      {t('filename')} : <span className="tag">{deliverable.filename}</span>
                    </li>
                    <li>
                      {t('mimetype')} : <span className="tag">{deliverable.mimetype}</span>
                    </li>
                    <li>
                      <a target="blank" className="button is-link" href={deliverableUrl}>{t('open/download deliverable')}</a>
                    </li>
                    <li>
                      <button className="button is-danger" onClick={onDelete}>
                        {t('delete deliverable')}
                      </button>
                    </li>
                  </ul>
                </div>
              </article>
            </li>
          );
        })
      }
    </ul>
  </section>
);

/**
 * Context data used by the component
 */
DeliverablesLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default DeliverablesLayout;
