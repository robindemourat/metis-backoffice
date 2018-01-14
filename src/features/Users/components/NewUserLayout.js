/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the new user view
 * @module backoffice/features/Users
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text, RadioGroup, Radio} from 'react-form';


import './NewUserLayout.scss';

const NewUser = ({
  router,

  actions: {
    createUser,
  }
}, {t}) => {
  const onSubmit = values => {
    createUser({
      ...values,
      admin: values.admin === 'yes' ? true : false
    });
    router.push('/users');
  };
  return (
    <section className="backoffice-NewUser container is-fluid">
      <h1 className="title is-1">{t('New user')}</h1>
      <Form defaultValues={{admin: 'no'}} onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1" className="section">
            <div className="field">
              <label className="label" htmlFor="email">{t('new user email')}</label>
              <div className="control">
                <Text
                  className="input" field="email" id="email"
                  type="email" />
              </div>
            </div>
            <div className="field">
              <label className="label" htmlFor="name">{t('new user name')}</label>
              <div className="control">
                <Text
                  className="input" field="name" id="name"
                  type="name" />
              </div>
            </div>
            <RadioGroup field="admin">
              {group => (
                <div className="control">
                  <label htmlFor="admin" className="radio">
                    <Radio group={group} value={t('yes')} id="yes" />
                    {t('new user is admin')}
                  </label>
                  <label htmlFor="no" className="radio">
                    <Radio group={group} value={t('no')} id="no" />
                    {t('new user is not admin')}
                  </label>
                </div>
            )}
            </RadioGroup>

            <button type="submit" className="button is-primary">Submit</button>
          </form>
      )}
      </Form>
    </section>
  );
};

/**
 * Context data used by the component
 */
NewUser.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default NewUser;
