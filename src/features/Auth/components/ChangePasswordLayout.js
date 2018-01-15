/**
 * This module exports a stateless component rendering the layout of the "change password" view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text} from 'react-form';


const ChangePasswordLayout = ({
  user,
  // clientStatus,
  // clientOperation,

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
    <section className="container is-fluid">
      <section className="section">
        <h1 className="title is-1">{t('Change my password')}</h1>
      </section>
      <Form onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1" className="section">
            <div className="field">
              <label htmlFor="newpassword" className="label">{t('new password')}</label>
              <div className="control">
                <Text
                  className="input" field="newpassword" id="newpassword"
                  type="password" />
              </div>
            </div>
            <div className="field">
              <label htmlFor="newpasswordconfirm" className="label">{t('confirm new password')}</label>
              <div className="control">
                <Text
                  className="input" field="newpasswordconfirm" id="newpasswordconfirm"
                  type="password" />
              </div>
            </div>
            <button className="button is-primary" type="submit">{t('submit new password')}</button>
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
