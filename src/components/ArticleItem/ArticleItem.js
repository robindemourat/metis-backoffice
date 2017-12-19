/* eslint react/no-set-state : 0 */
/**
 * Backoffice Application
 * =======================================
 * Article item (for lists)
 * @module backoffice
 */
import React, {Component} from 'react';

export default class ArticleItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.article.title
    };
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.article.title !== this.state.title) {
      this.setState({
        title: nextProps.article.title
      });
    }
  }

  onTitleChange = e => {
    const title = e.target.value;
    this.setState({title});
  }

  onUpdateTitle = () => {
    this.props.onChange({
      ...this.props.article,
      title: this.state.title,
    });
  }


  render() {
    const {
      props: {
        article,
        onDelete,
        // onChange
      },
      state: {
        title
      },
      onTitleChange,
      onUpdateTitle,
    } = this;
    return (
      <li>
        <input value={title} onChange={onTitleChange} />
        {article.title !== title && <button onClick={onUpdateTitle}>Mettre à jour</button>}
        <div>
          <p><a href={`articles/${article._id}`}>Éditer</a></p>
          <p>
            <button onClick={onDelete}>Supprimer</button>
          </p>
        </div>
      </li>
    );
  }
}
