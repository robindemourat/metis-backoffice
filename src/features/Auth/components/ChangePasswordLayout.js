/**
 * This module exports a stateless component rendering the layout of the "change password" view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text} from 'react-form';


const ChangePasswordLayout = ({
  user,
  clientStatus,
  clientOperation,

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
    else {
      // @todo: implement password match in state or read react-form doc to handle that
      alert(t('password are not identical'));/* eslint no-alert: 0 */
      // console.error(t('passwords are not identical'));
    }
  };
  return (
    <section>
      <div>
        {clientOperation} - {clientStatus}
      </div>
      <Form onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <label htmlFor="newpassword">{t('new password')}</label>
            <Text field="newpassword" id="newpassword" type="password" />

            <label htmlFor="newpasswordconfirm">{t('confirm new password')}</label>
            <Text field="newpasswordconfirm" id="newpasswordconfirm" type="password" />
            <button type="submit">{t('submit new password')}</button>
          </form>
    )}
      </Form>
    </section>
);
};

/**
 * Context data used by the component
 */
ChangePasswordLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ChangePasswordLayout;
