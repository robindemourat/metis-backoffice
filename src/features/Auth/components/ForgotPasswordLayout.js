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
    <section>
      <h1>{t('you forgot your password')}</h1>
      <p>
        {t('please submit your email and a reset link will be sent to you')}
      </p>
      <p>{clientOperation} - {clientStatus}</p>
      <Form onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <label htmlFor="email">{t('your email')}</label>
            <Text field="email" id="email" type="email" />
            <button type="submit">{t('send email reset request')}</button>
          </form>
    )}
      </Form>
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
