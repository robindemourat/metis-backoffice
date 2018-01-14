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
        <div className="field">
          <label htmlFor="email" className="label">Email</label>
          <div className="control">
            <Text
              className="input" field="email" id="email"
              type="email" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="password" className="label">Mot de passe</label>
          <div className="control">
            <Text
              className="input" field="password" id="password"
              type="password" />
          </div>
        </div>

        <button className="button is-primary" type="submit">Submit</button>
      </form>
  )}
  </Form>
);
