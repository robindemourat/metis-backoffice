/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the single user view
 * @module backoffice/features/Users
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text} from 'react-form';

import './UserLayout.scss';

const UserLayout = ({
  ownUser,
  editedUser,

  actions: {
    updateUser,
  },

}, {t}) => {
  const onSubmit = values => {
    const newUser = {
      ...editedUser,
      ...values,
    };
    updateUser(newUser._id, newUser);
  };
  return editedUser ? (
    <section className="backoffice-User container is-fluid">
      <h1 className="title is-1">{editedUser.name}</h1>
      <section className="section">
        <p>{t('Email')} : {editedUser.email}</p>
        <p>{t('Admin')} : {editedUser.admin ? t('yes') : t('no')}</p>
      </section>
      {editedUser && <Form defaultValues={editedUser} onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1" className="section">
            <div className="field">
              <label className="label">{t('name')}</label>
              <div className="control">
                <Text
                  className="input" field="name" id="name"
                  type="name" />
              </div>
            </div>
            <div className="field">
              <label className="label">{t('email')}</label>
              <div className="control">
                <Text
                  className="input" field="email" id="email"
                  type="email" />
              </div>
            </div>

            <button className="button is-primary" type="submit">{t('save user')}</button>
          </form>
        )}
      </Form>}
      {ownUser._id === editedUser._id &&
        <p className="section">
          <a className="button is-link" href="/change-password">{t('change password')}</a>
        </p>
      }
    </section>
  ) : null;
};

/**
 * Context data used by the component
 */
UserLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default UserLayout;
