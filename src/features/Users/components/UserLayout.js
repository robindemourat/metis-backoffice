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
    <section className="backoffice-User">
      <p>{editedUser.name}</p>
      <p>{editedUser.email}</p>
      <p>Admin : {editedUser.admin ? t('yes') : t('no')}</p>
      {editedUser && <Form defaultValues={editedUser} onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <Text field="name" id="name" type="name" />
            <Text field="email" id="email" type="email" />

            <button type="submit">{t('save user')}</button>
          </form>
        )}
      </Form>}
      {ownUser._id === editedUser._id && <p><a href="/change-password">{t('change password')}</a></p>}
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
