/**
 * This module exports a stateless component rendering the layout of the "forgot password" view
 * @module backoffice/features/Auth
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text} from 'react-form';


const ForgotPasswordLayout = ({
  clientStatus,
  clientOperation,

  actions: {
    requestPasswordReset
  }
}, {t}) => {
  const onSubmit = values => {
    requestPasswordReset(values.email);
  };
  return (
    <section className="container is-fluid">
      <section className="section">
        <h1 className="title is-1">{t('You forgot your password ! no worries ;)')}</h1>
        <p>
          {t('Please submit your email and a reset link will be sent to you !')}
        </p>
        <p>{clientOperation} - {clientStatus}</p>
        <Form onSubmit={onSubmit}>
          { formApi => (
            <form onSubmit={formApi.submitForm} id="form1">
              <div className="field">
                <label htmlFor="email" className="label">{t('your email')}</label>
                <div className="control">
                  <Text
                    className="input" field="email" id="email"
                    type="email" />
                </div>
              </div>
              <button className="button is-primary" type="submit">{t('send email reset request')}</button>
            </form>
      )}
        </Form>
      </section>
    </section>
);
};

/**
 * Context data used by the component
 */
ForgotPasswordLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ForgotPasswordLayout;
