/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the single article view
 * @module backoffice/features/Articles
 */
import React from 'react';
import PropTypes from 'prop-types';
import {Form, Text, TextArea} from 'react-form';

import './ArticleLayout.scss';

const ArticleLayout = ({

  clientOperation,
  clientStatus,

  editedArticle,
  actions: {
    updateArticle,
  }
}, {t}) => {
  const onSubmit = values => {
    const newArticle = {
      editedArticle,
      ...values,
    };
    updateArticle(newArticle._id, newArticle);
  };
  return (
    <section className="backoffice-Article">
      <div>{clientOperation} - {clientStatus}</div>
      {editedArticle && <Form defaultValues={editedArticle} onSubmit={onSubmit}>
        { formApi => (
          <form onSubmit={formApi.submitForm} id="form1">
            <Text field="title" id="title" type="title" />
            <TextArea field="content" id="content" type="content" />
            <button type="submit">{t('save article')}</button>
          </form>
        )}
      </Form>}
    </section>
  );
};

/**
 * Context data used by the component
 */
ArticleLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ArticleLayout;
