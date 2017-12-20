import React, {Component} from 'react';
import PropTypes from 'prop-types';
import defaults from 'json-schema-defaults';
import Ajv  from 'ajv';


import {get, set} from 'dot-prop';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

import AssetWidget from '../AssetWidget/AssetWidget';

const ajv = new Ajv();


const ErrorDisplay = ({error}) => (
  <li>
   {error.message} 
  </li>
)

const makeForm = (totalSchema, model, totalObject, value, level, key, path, onChange, required) => {
  
  const render = () => {
  
        switch(model.type) {
          case 'array':
            const addElement = () => {
              const newElement = defaults(model.items);
              const newArray = [...value, newElement];
              onChange(path, newArray);
            }
            return (
              <ul>
                {
                  value.map((element, index) => {
                    const onDelete = () => {
                      const newArray = [...value.slice(0, index), ...value.slice(index + 1)];
                      onChange(path, newArray);
                    }
                    return (
                    <li key={index}>
                      {makeForm(
                        totalSchema, 
                        model.items, 
                        totalObject, 
                        element, 
                        level + 1, 
                        key, 
                        [...path, index], 
                        onChange
                      )}
                      <button onClick={onDelete}>delete</button>
                    </li>
                  )
                  })
                }
                <li><button  onClick={addElement}>Add {key.replace(/s$/, '')}</button></li>
              </ul>
            )
          case 'string':
            if (key.indexOf('asset_id') > -1) {
              return (
                <AssetWidget
                  name={key}
                  value={value}
                  onChange={val => onChange(path, val)}
                  accept={model.accept_mimetypes}
                />
              )
            }
            else if (model.enum) {
              return (
               <Select
                  name={key}
                  value={value}
                  onChange={e => onChange(path, e.value)}
                  options={
                    model.enum.map(value => ({value, label: value}))
                  }
                />);
            } else {
              return (
                <textarea
                  value={value}
                  onChange={e => onChange(path, e.target.value)}
                />
              );
            }
          case 'object':
            return (
              <div>
                {
                  model.properties &&
                  Object.keys(model.properties)
                  .map(key => (
                    <div key={key}>
                      {makeForm(
                        totalSchema, 
                        model.properties[key], 
                        totalObject, 
                        value[key], 
                        level + 1, 
                        key, 
                        [...path, key], 
                        onChange, 
                        model.required && model.required.indexOf(key) > -1
                      )}
                    </div>
                  ))
                }
              </div>
            )
          default:
            if (model.oneOf && model.oneOfFrom) {
              const type = get(totalObject, model.oneOfFrom);
              const refs = totalSchema.definitions;
              const subModel = refs[type];
              if (subModel) {
                return makeForm(totalSchema, subModel, totalObject, value, level + 1, key, [...path], onChange)
              }
            }
            return (<pre>{JSON.stringify(model, null, 2)}</pre>)
        }
      }
  return (
    <div style={{marginLeft: level * 10}}>
      {(model.title || key) && <h2>{model.title || key}</h2>}
      {model.description && <p>{model.description}</p>}
      {render()}
      {required && <p>Required</p>}
    </div>
  )
}


export default class SchemaForm extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);

    this.state = {
      document: props.document || defaults(props.schema)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.document !== nextProps.document) {
      this.setState({
        document: nextProps.document || defaults(props.schema)
      })
    }
  }

  onChange = (path, value) => {
    const {
      state: {
        document
      },
      props: {
        schema
      }
    } = this;
    const newDocument = set({...document}, path.join('.'), value);
    const valid = ajv.validate(schema, newDocument);
    
    this.setState({
      document: newDocument,
      errors: valid.errors
    })
  }

  onValidate = () => {
    const {
      state: {
        document
      },
      props: {
        schema,
        onSubmit
      }
    } = this;
    const valid = ajv.validate(schema, document);
    if (valid) {
      onSubmit(document);
    } else {
      const errors = ajv.errors;
      this.setState({
        errors
      })
    }
  }

  render() {
    const {
      state: {
        document,
        errors
      },
      props: {
        schema,
        title,
        onCancel
      },
      context: {
        t
      },
      onChange,
      onValidate
    } = this;

    return (
      <form onSubmit={onValidate}>
        <h1>{title}</h1>
        {makeForm(schema, schema, document, document, 0, undefined, [], onChange)}
        {errors &&
          <ul>
            {errors.map((error, key) => (
              <ErrorDisplay 
                key={key}
                error={error}
              />
            ))}
          </ul>
        }
        <ul>
          <li><button onClick={onValidate}>{t('validate')}</button></li>
          <li><button onClick={onCancel}>{t('cancel')}</button></li>
        </ul>
      </form>
    )
  }
}