/* eslint react/jsx-no-bind : 0 */
/**
 * Backoffice Application
 * =======================================
 * Login form component
 * @module backoffice
 */
import React from 'react';
import {Form, Text} from 'react-form';

export default ({
  onSubmit
}) => (
  <Form onSubmit={onSubmit}>
    { formApi => (
      <form onSubmit={formApi.submitForm} id="form1">

        <label htmlFor="email">Email</label>
        <Text field="email" id="email" type="email" />

        <label htmlFor="password">Mot de passe</label>
        <Text field="password" id="password" type="password" />

        <button type="submit">Submit</button>
      </form>
  )}
  </Form>
);
