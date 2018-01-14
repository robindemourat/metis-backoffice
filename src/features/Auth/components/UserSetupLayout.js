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
    <section className="container is-fluid">
      <h1 className="title is-1">{t('welcome on the backoffice, {n}', {n: user.name})}</h1>
      <section className="section">
        <p>{t('enter a new password to begin with')}</p>
        <Form onSubmit={onSubmit}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="form1">
              <div className="field">
                <label className="label" htmlFor="newpassword">{t('new password')}</label>
                <div className="control">
                  <Text
                    className="input" field="newpassword" id="newpassword"
                    type="password" />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="newpasswordconfirm">{t('confirm the new password')}</label>
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
        <div>
          {clientOperation} - {clientStatus}
        </div>
      </section>
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
