/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the operations view
 * @module plurishing-backoffice/features/Operations
 */
import React from 'react';
import PropTypes from 'prop-types';

import './OperationsLayout.scss';

import DropZone from '../../../components/DropZone/DropZone';


const OperationsLayout = ({

  dumpUrl,

  actions: {
    uploadDump,
    deleteAllData,
  },
}, {t}) => {

  const onDelete = () => {
    if (confirm(t('Are you sure you want to delete all data ?'))) {/* eslint no-alert : 0 */
      deleteAllData();
    }
  };

  const onDrop = files => {
    const file = files[0];
    if (file.name.split('.').pop() === 'zip') {
      const data = new FormData();
      data.append('file', file);
      uploadDump(data);
    }
  };
  return (
    <section className="plurishing-backoffice-Operations">
      <section>
        <h3>{t('download all data (dump)')}</h3>
        <div>
          <a target="blank" href={dumpUrl}>{t('download all data (dump)')}</a>
        </div>
      </section>
      <section>
        <h3>{t('upload new data from dump')}</h3>
        <div>
          <DropZone
            onDrop={onDrop}>
            <p>{t('drop here a zip file previously downloaded on this page')}</p>
          </DropZone>
        </div>
      </section>
      <section>
        <h3>{t('delete all data (clear all database except users)')}</h3>
        <div>
          <button onClick={onDelete}>{t('delete all data')}</button>
        </div>
      </section>
    </section>
  );
};

/**
 * Context data used by the component
 */
OperationsLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default OperationsLayout;
