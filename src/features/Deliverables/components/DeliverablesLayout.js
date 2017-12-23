/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the deliverables view
 * @module plurishing-backoffice/features/Deliverables
 */
import React from 'react';
import PropTypes from 'prop-types';

import './DeliverablesLayout.scss';

import getConfig from '../../../helpers/getConfig';
const config = getConfig();
const {apiBaseUri} = config;

const DeliverablesLayout = ({
  deliverables = [],
}, {t}) => (
  <section className="plurishing-backoffice-Deliverables">
    <ul>
      {
        deliverables.map((deliverable, index) => {
          const attachmentName = deliverable.filename;
          const deliverableUrl = `${apiBaseUri}deliverables/${deliverable._id}/${attachmentName}`;

          return (
            <li
              key={index}>
              <ul>

                <li>
                  {t('montage title')} : {deliverable.montage_title}
                </li>
                <li>
                  {t('version')} : {deliverable.version}
                </li>
                <li>
                  {t('date')} : {deliverable.date_produced}
                </li>
                <li>
                  <a target="blank" href={deliverableUrl}>{t('open/download deliverable')}</a>
                </li>
                <li>
                  {t('montage type')} : {deliverable.montage_type}
                </li>
                <li>
                  {t('filename')} : {deliverable.filename}
                </li>
                <li>
                  {t('mimetype')} : {deliverable.mimetype}
                </li>
              </ul>
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
