import React from 'react';
import PropTypes from 'prop-types';

import './MailingPreview.scss';

import Oy from 'oy-vey';
const {
  Table,
  TBody,
  TR: Tr,
  TD: Td
} = Oy;


const MailingPreview = ({
  montage: {
    data: {
      include_abstract: includeAbstract,
      montage_url: montageUrl
    },
  },
  composition: {
      metadata: {
        title,
        abstract_original: abstractOriginal
      }
    }
}, {t}) => {
  return (
    <div className="plurishing-backoffice-MailingPreview">
      <div className="header">
        <div className="row">
          <span className="label">{t('from')}</span>
          <span className="value">Plurishing team</span>
        </div>
        <div className="row">
          <span className="label">{t('to')}</span>
          <span className="value">The world</span>
        </div>
        <div className="row">
          <span className="label">{t('object')}</span>
          <span className="value">Plurishing - {title}</span>
        </div>
      </div>
      <div className="body">
        <Table>
          <TBody>
            <Tr>
              <Td align="left">
                <b><a href={montageUrl}>{title}</a></b>
                <br />
                {includeAbstract && <p>
                    {abstractOriginal}
                  </p>}
              </Td>
            </Tr>
          </TBody>
        </Table>
      </div>
    </div>
  );
};

MailingPreview.contextTypes = {
  t: PropTypes.func.isRequired
};

export default MailingPreview;
