/* eslint react/jsx-no-bind : 0 */
/**
 * This module exports a stateless component rendering the layout of the articles view
 * @module backoffice/features/Articles
 */
import React from 'react';
import PropTypes from 'prop-types';

import ArticleItem from '../../../components/ArticleItem/ArticleItem';

import './ArticlesLayout.scss';

const ArticlesLayout = ({
  articles = [],

  clientStatus,
  clientOperation,

  actions: {
    createArticle,
    deleteArticle,
    updateArticle,
  }
}, {t}) => (
  <section className="backoffice-Articles">
    <div>
      {clientOperation} - {clientStatus}
    </div>
    <ul>
      {
        articles.map((article, index) => {
          const onDelete = () => deleteArticle(article._id);
          const onUpdate = newArticle => updateArticle(article._id, newArticle);
          return (
            <ArticleItem
              key={index}
              article={article}
              onDelete={onDelete}
              onChange={onUpdate} />
          );
        })
      }
      <li>
        <a onClick={createArticle}>{t('new article')}</a>
      </li>
    </ul>
  </section>
);

/**
 * Context data used by the component
 */
ArticlesLayout.contextTypes = {

  /**
   * Un-namespaced translate function
   */
  t: PropTypes.func.isRequired
};


export default ArticlesLayout;
