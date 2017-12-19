/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the users view
 * @module backoffice/features/Users
 */
import React from 'react';
import PropTypes from 'prop-types';


import './UsersLayout.scss';

const UsersLayout = ({
  users = [],

  ownUser,

  // clientState,
  clientStatus,
  clientOperation,

  actions: {
    deleteUser,
  },
}, {t}) => (
  <section className="backoffice-Users">
    <div>
      {clientOperation} - {clientStatus}
    </div>
    <ul>
      {
        users.map((user, index) => {
          const onDelete = () => deleteUser(user._id);
          return (
            <li key={index}>
              <p><a href={`users/${user._id}`}>{user.name}</a></p>
              <p>{user.email}</p>
              <p>Admin : {user.admin ? 'oui' : 'non'}</p>
              {user._id !== ownUser._id && <button onClick={onDelete}>{t('delete user')}</button>}
            </li>
          );
        })
      }
      <li>
        <a href="new-user">{t('new user')}</a>
      </li>
    </ul>
  </section>
);

/**
 * Context data used by the component
 */
UsersLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default UsersLayout;
