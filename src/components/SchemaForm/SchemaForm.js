/* eslint react/no-set-state : 0 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import defaults from 'json-schema-defaults';
import DatePicker from 'react-datepicker';
import {SketchPicker as ColorPicker} from 'react-color';
import Textarea from 'react-textarea-autosize';


import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

import Ajv from 'ajv';

import Select from 'react-select';

import 'react-select/dist/react-select.css';

// import {get, set} from 'dot-prop';
import {get, set} from '../../helpers/dot-prop';

import AssetWidget from '../AssetWidget/AssetWidget';
import CompositionWidget from '../CompositionWidget/CompositionWidget';
import MontageWidget from '../MontageWidget/MontageWidget';
import CodeEditor from '../CodeEditor/CodeEditor';

import './SchemaForm.scss';

const ajv = new Ajv();

const ErrorDisplay = ({error}) => (
  <li>
    {error.message}
  </li>
);

/**
 * Generates an edition interface out of a json-schema portion and corresponding object part
 * @param {object} totalSchema - global schema being used to edit object (needed for references to definitions for instance)
 * @param {object} model - locally scoped part of the global schema
 * @param {object} totalObject - total object being edited
 * @param {object|boolean|array|string|number} value - current value being edited
 * @param {number} level - level of nesting of the form
 * @param {string} key - key of the current property being scoped by the form
 * @param {array} path - dotprop path from the total object to the current value
 * @param {onChange} function - callback
 * @param {boolean} required - whether edited property is required
 * @return {ReactMarkup} form - the form part corresponding to form scope
 */
const makeForm = (totalSchema, model, totalObject, value, level, key, path, onChange, required, translate) => {
  const render = () => {
        let onRadioClick;

        switch (model.type) {
          // value is a boolean
          case 'boolean':
            onRadioClick = () => {
              onChange(path, !value);
            };
            return (
              <div onClick={onRadioClick}>
                <input
                  type="radio"
                  id={key}
                  name={key}
                  value={key}
                  onChange={onRadioClick}
                  checked={value || false} />
                <label htmlFor={key}>{translate(key)}</label>
              </div>
              );
          // value is a number
          case 'number':
            // ... representing an absolute date time
            if (key.indexOf('date') === 0) {
              const onDateChange = m => {
                onChange(path, m.toDate().getTime());
              };
              return (
                <DatePicker
                  selected={value ? moment(value) : moment()}
                  onChange={onDateChange} />
              );
            }
            // ... a plain number
            return (
              <input
                className="input"
                value={value || ''}
                onChange={e => onChange(path, +e.target.value)} />
            );
          // value is an array
          case 'array':
            // ... offering several enumerable options (checkbox)
            if (model.items && model.items.enum) {
              const activeValue = value || [];
              return (
                <ul>
                  {
                    model.items.enum.map((item) => {
                      const checked = activeValue.indexOf(item) > -1;
                      onRadioClick = () => {
                        let newValue;
                        // uncheck option
                        if (checked) {
                          newValue = activeValue.filter(val => val !== item);
                          onChange(path, newValue);
                        // check option
                        }
                        else {
                          newValue = [...activeValue, item];
                        }
                        onChange(path, newValue);
                      };
                      return (
                        <li key={item}>
                          <label className="checkbox" htmlFor={item}>
                            <input
                              type="checkbox"
                              id={item}
                              name={key}
                              value={item}
                              onChange={onRadioClick}
                              checked={checked || false} />
                            {item}
                          </label>
                        </li>
                      );
                    })
                  }
                </ul>
              );
            }
            // array allowing to manage a list of objects (e.g. authors)
            else {
              const activeValue = (value && Array.isArray(value)) ? value : [];
              const addElement = () => {
                const newElement = defaults(model.items);
                const newArray = [...activeValue, newElement];
                onChange(path, newArray);
              };
              return (
                <ul>
                  {
                    activeValue.map((element, index) => {
                      const onDelete = () => {
                        const newArray = [...activeValue.slice(0, index), ...activeValue.slice(index + 1)];
                        onChange(path, newArray);
                      };
                      const onUp = () => {
                        const newArray = [...activeValue.slice(0, index - 1), element, activeValue[index - 1], ...activeValue.slice(index + 1)];
                        onChange(path, newArray);
                      };
                      const onDown = () => {
                        const newArray = [...activeValue.slice(0, index), activeValue[index + 1], element, ...activeValue.slice(index + 2)];
                        onChange(path, newArray);
                      };
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
                          onChange,
                          false,
                          translate
                        )}
                          {index > 0 && <button className="button is-secondary" onClick={onUp}>{translate('up')}</button>}
                          {index < value.length - 1 && <button className="button is-secondary" onClick={onDown}>{translate('down')}</button>}
                          <button className="button is-danger" onClick={onDelete}>{translate('delete')}</button>
                        </li>
                    );
                    })
                  }
                  <li className="section"><button className="button is-primary is-fullwidth" onClick={addElement}>{translate(`Add ${key.replace(/s$/, '')}`)}</button></li>
                </ul>
              );

            }
          // value is a string ...
          case 'string':
            // pointing to an asset id
            if (key.indexOf('asset_id') > -1) {
              return (
                <AssetWidget
                  name={key}
                  value={value}
                  onChange={val => onChange(path, val)}
                  accept={model.accept_mimetypes} />
              );
            }
            // pointing to an montage id
            else if (key.indexOf('montage_id') > -1) {
              return (
                <MontageWidget
                  name={key}
                  value={value}
                  onChange={val => onChange(path, val)} />
              );
            }
            // pointing to a composition id
            else if (key.indexOf('composition_id') > -1) {
              return (
                <CompositionWidget
                  name={key}
                  value={value}
                  onChange={val => onChange(path, val)} />
              );
            }
            // pointing to a code field
            else if (key.indexOf('_code') > -1) {
              const mode = key.indexOf('css') > -1 ? 'css' : 'javascript';
              return (
                <CodeEditor
                  value={value}
                  mode={mode}
                  onChange={val => onChange(path, val)} />
              );
            }
            // pointing to a color field
            else if (key.indexOf('_color') > -1) {
              return (
                <ColorPicker
                  color={value}
                  onChange={val => onChange(path, val.hex)} />
              );
            }
            // value is an enumerable string (select)
            else if (model.enum) {
              if (model.enum.length > 1) {
                return (
                  <Select
                    name={key}
                    value={value}
                    onChange={e => onChange(path, e.value)}
                    clearable={false}
                    searchable={false}
                    options={
                      model.enum.map(thatValue => ({value: thatValue, label: translate(thatValue)}))
                    } />);
              }
              // only one value enumerable --> informative
              else {
                return (
                  <p>
                    <span className="tag">{value}</span>
                  </p>
                );
              }
            }
            // value is a plain string
            else if (model.longString) {
              return (
                <Textarea
                  value={value}
                  className="textarea"
                  placeholder={translate(model.description)}
                  onChange={e => onChange(path, e.target.value)} />
              );
            }
            else {
              return (
                <input
                  value={value || ''}
                  className="input"
                  placeholder={translate(model.description)}
                  onChange={e => onChange(path, e.target.value)} />
              );
            }
          // value is an object ...
          case 'object':
            const actualValue = value || {};
            // value has properties -> nest a new properties manager
            return (
              <div>
                {
                  model.properties &&
                  Object.keys(model.properties)
                  // display only editable properties
                  .filter(id =>
                    model.properties[id].editable === undefined || model.properties[id].editable === true
                  )
                  // represent a property manager for each property
                  .map(thatKey => (
                    <div key={thatKey}>
                      {makeForm(
                        totalSchema,
                        model.properties[thatKey],
                        totalObject,
                        actualValue[thatKey],
                        level + 1,
                        thatKey,
                        [...path, thatKey],
                        onChange,
                        model.required && model.required.indexOf(thatKey) > -1,
                        translate
                      )}
                    </div>
                  ))
                }
              </div>
            );
          default:
            // value is a reference to a definition properties set
            if (model.anyOf && model.anyOfFrom) {
              const type = get(totalObject, model.anyOfFrom);
              const refs = totalSchema.definitions;
              const subModel = refs[type];
              if (subModel) {
                return makeForm(totalSchema, subModel, totalObject, value, level + 1, key, [...path], onChange, false, translate);
              }
            }
            // default: render as json
            /**
             * @todo : remove this when sure each usecase has been handled
             */
            return (<pre>{JSON.stringify(model, null, 2)}</pre>);
        }
      };
  return (
    <div style={{marginLeft: level * 4}} className="schema-item">
      {(model.title || key) &&
        <h2 className={`title is-${level + 3}`}>
          <span>{translate(model.title || key)}</span> {required && <span className="tag is-danger">{translate('required')}</span>}
        </h2>
      }
      {model.description && <p>{translate(model.description)}</p>}
      {render()}
    </div>
  );
};


export default class SchemaForm extends Component {

  static contextTypes = {
    t: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props);


    this.state = {
      document: props.document || defaults(props.schema)
    };
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.document !== nextProps.document) {
      this.setState({
        document: nextProps.document || defaults(this.props.schema)
      });
    }
  }

  onChange = (path, value) => {
    const {
      state: {
        document
      },
      props: {
        schema,
        onAfterChange
      }
    } = this;
    const newDocument = set({...document}, path.join('.'), value);
    let valid = ajv.validate(schema, newDocument);

    this.setState({
      document: newDocument,
      errors: ajv.errors
    });
    // upstream hook
    if (typeof onAfterChange === 'function') {
      onAfterChange(newDocument, path)
        .then(transformedDocument => {
          valid = ajv.validate(schema, transformedDocument);
          this.setState({
            document: transformedDocument,
            errors: valid.errors
          });
        })
        .catch(error => {
          this.setState({
            errors: [{message: 'upstream error', error}]
          });
        });
    }
  }

  onValidate = e => {
    if (e && e.preventDefault) {
      e.stopPropagation();
      e.preventDefault();
    }
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
    }
    else {
      const errors = ajv.errors;
      this.setState({
        errors
      });
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
      <form onSubmit={e => e.preventDefault()} className="plurishing-SchemaForm">
        {title && <h1 className="title is-3">{title}</h1>}
        {makeForm(schema, schema, document, document, 0, undefined, [], onChange, false, t)}
        {errors &&
          <ul>
            {errors.map((error, key) => (
              <ErrorDisplay
                key={key}
                error={error} />
            ))}
          </ul>
        }
        <ul className="columns">
          <li className="column">
            <button className="button is-fullwidth is-primary" onClick={onValidate}>{t('validate')}</button>
          </li>
          <li className="column">
            <button className="button is-fullwidth is-warning" onClick={onCancel}>{t('cancel')}</button>
          </li>
        </ul>
      </form>
    );
  }
}
