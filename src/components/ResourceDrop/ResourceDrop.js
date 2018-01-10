import React, {Component} from 'react';

import DropZone from '../DropZone/DropZone';

import {parseBibTeXToCSLJSON} from 'plurishing-shared/dist/utils/assetsUtils';


/**
 * Reads the raw string content of a file from user file system
 * @param {File} fileToRead - the file to read
 * @param {function} callback
 */
export function getFileAsText(fileToRead) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    // Handle errors load
    reader.onload = (event) => {
      resolve(event.target.result);
      reader = undefined;
    };
    reader.onerror = (event) => {
      reject(event.target.error);
      reader = undefined;
    };
    // Read file into memory as UTF-8
    reader.readAsText(fileToRead);
  });
}


export default class ResourceDrop extends Component {


  onDrop = inputFiles => {
    // keep only bibtex files
    const files = inputFiles.filter(file => file.name.split('.').pop() === 'bib');
    // read all files (if several)
    const toResolve = files.map(file => getFileAsText(file));

    Promise.all(toResolve)
      .then(strs => {
        // convert all dropped content as a big str
        const str = strs.join('\n\n');
        // convert to csl json objects
        const csl = parseBibTeXToCSLJSON(str);
        // convert to resources
        const resources = csl.map(citation => ({
          metadata: {
            name: citation.title,
            /**
             * @todo when importing bib parse csl-json authors to determine resource creators
             */
          },
          data: citation
        }));
        // callback
        this.props.onDrop(resources);
      });
  }

  render() {
    const {
      props: {
        title
      },
      onDrop
    } = this;
    return (
      <DropZone
        onDrop={onDrop}>
        <h4>{title}</h4>
      </DropZone>
    );
  }
}
