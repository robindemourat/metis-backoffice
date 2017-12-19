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
    <section className="backoffice-NewUser">
      <h1>{t('new user')}</h1>
      <Form defaultValues={{admin: 'no'}} onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <label htmlFor="email">{t('new user email')}</label>
            <Text field="email" id="email" type="email" />
            <label htmlFor="name">{t('new user name')}</label>
            <Text field="name" id="name" type="name" />
            <RadioGroup field="admin">
              {group => (
                <div>
                  <label htmlFor="admin">{t('new user is admin')}</label>
                  <Radio group={group} value={t('yes')} id="yes" />
                  <label htmlFor="no">{t('new user is not admin')}</label>
                  <Radio group={group} value={t('no')} id="no" />
                </div>
            )}
            </RadioGroup>

            <button type="submit">Submit</button>
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
