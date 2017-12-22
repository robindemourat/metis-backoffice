/* eslint no-unused-vars : 0 */
/* eslint react/no-set-state : 0 */
/**
 * This module provides a code editor element component
 * Sets the mode of an aside ui column
 * @module plurishing-backoffice/components/CodeEditor
 */
import React, {Component} from 'react';
import {Controlled as CodeMirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import js from 'codemirror/mode/javascript/javascript';
import xml from 'codemirror/mode/xml/xml';
import css from 'codemirror/mode/css/css';

import './CodeEditor.scss';

class CodeEditor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || ''
    };
  }


  onChange = (editor, metadata, code) => {
    if (this.props.onChange && typeof this.props.onChange === 'function') {
      this.props.onChange(code);
    }
  };

  onClick= e => {
    if (this.props.onClick && typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
    if (this.props.onFocus && typeof this.props.onFocus === 'function') {
      this.props.onFocus(e);
    }
    e.stopPropagation();
  }

  render() {
    const {
      onChange,
      onClick,
      props: {
        // value = '',
        mode = 'javascript',
        lineNumbers = true
      },
      state: {
        value
      }
    } = this;
    return (
      <div className="plurishing-backoffice-CodeEditor" onClick={onClick}>
        <CodeMirror
          value={value}
          options={{
            mode,
            lineNumbers
          }}
          onBeforeChange={(editor, data, thatValue) => {
            this.setState({value: thatValue}); // state management here
          }}
          onChange={(editor, data, thatValue) => {
            // downstream callback
            this.onChange(editor, data, thatValue);
          }} />
      </div>
    );
  }
}

export default CodeEditor;
