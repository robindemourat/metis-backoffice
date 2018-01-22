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

  actions: {
    deleteUser,
  },
}, {t}) => (
  <section className="backoffice-Users container is-fluid">
    <section className="section">
      <h1 className="title is-1">{t('Users')}</h1>
    </section>
    <ul>
      <li className="section">
        <a className="button is-primary is-fullwidth" href="new-user">{t('new user')}</a>
      </li>
      {
        users.map((user, index) => {
          const onDelete = () => deleteUser(user._id);
          return (
            <li key={index} className="box">
              <article className="media">
                <div className="media-left">
                  <figure className="image is-64x64">
                    <img src="https://bulma.io/images/placeholders/128x128.png" alt="Image" />
                  </figure>
                </div>
                <div className="media-content">
                  <div className="content">
                    <p className="title"><a href={`users/${user._id}`}>{user.name}</a></p>
                    <p>{t('email')} : {user.email}</p>
                    <p>Admin : {user.admin ? t('yes') : t('no')}</p>
                    {user._id !== ownUser._id && <button onClick={onDelete} className="button is-danger">{t('delete user')}</button>}
                  </div>
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
UsersLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default UsersLayout;
