/**
 * This module exports a stateless component rendering the layout of the user setup view
 * @module backoffice/features/Users
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text} from 'react-form';


const UserSetupLayout = ({

  clientStatus,
  clientOperation,

  user,
  actions: {
    changePassword
  }
}, {t}) => {
  const onSubmit = values => {
    if (values.newpassword === values.newpasswordconfirm) {
      changePassword({
        ...user,
        password: values.newpassword,
      });
    }
  };
  return user ? (
    <section>
      <h1>{t('welcome on the backoffice, {n}', {n: user.name})}</h1>
      <p>{t('enter a new password to begin with')}</p>
      <Form onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <label htmlFor="newpassword">{t('new password')}</label>
            <Text field="newpassword" id="newpassword" type="password" />

            <label htmlFor="newpasswordconfirm">{t('confirm the new password')}</label>
            <Text field="newpasswordconfirm" id="newpasswordconfirm" type="password" />
            <button type="submit">{t('submit new password')}</button>
          </form>
        )}
      </Form>
      <div>
        {clientOperation} - {clientStatus}
      </div>
    </section>
  ) :
  (
    <section>
      {t('connecting to database ...')}
    </section>
  )
  ;
};
/**
 * Context data used by the component
 */
UserSetupLayout.contextTypes = {
  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};

export default UserSetupLayout;
