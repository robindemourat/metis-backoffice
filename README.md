# metis-backoffice 

Metis-backoffice is a front-end interface to the backend used to run the `metis` experimental plateform for multimodal publishing.

## Installation

```sh
git clone https://github.com/robindemourat/metis-backoffice
cd metis-backoffice
```

## Scripts

```sh
# run in dev mode with hot reloading
npm run dev

# build code for production
npm run build

# lint source code
npm run lint

# prettify (s)css code
npm run comb

# run unit tests
npm run test

# deploy to surge service easily
npm run deploy

# discover new translation keys
npm run translations:discover

# backfill untranslated key
npm run translations:backfill

# discover and backfil translations
npm run translations:update
```

## Tests

```sh
npm install
npm test
```

## Dependencies

- [ajv](https://github.com/epoberezkin/ajv): Another JSON Schema Validator
- [axios](https://github.com/axios/axios): Promise based HTTP client for the browser and node.js
- [bulma](https://github.com/jgthms/bulma): Modern CSS framework based on Flexbox
- [citation-js](https://github.com/larsgw/citation.js): Citation.js converts formats like BibTeX, Wikidata JSON and ContentMine JSON to CSL-JSON to convert to other formats like APA, Vancouver and back to BibTeX.
- [codemirror](https://github.com/codemirror/CodeMirror): Full-featured in-browser code editor
- [dot-prop](https://github.com/sindresorhus/dot-prop): Get, set, or delete a property from a nested object using a dot path
- [draft-js](https://github.com/facebook/draft-js): A React framework for building text editors.
- [json-schema-defaults](https://github.com/chute/json-schema-defaults): Generate JSON object from default values in JSON Schema
- [moment](https://github.com/moment/moment): Parse, validate, manipulate, and display dates
- [oy-vey](https://github.com/oysterbooks/oy): React utilities for building server-side email templates.
- [metis-schemas](): Multimodal publishing schemas
- [metis-shared](): Collection of metis elements being used accross apps
- [react](https://github.com/facebook/react): React is a JavaScript library for building user interfaces.
- [react-citeproc](https://github.com/robindemourat/react-citeproc): react wrapping components for csl-based citations
- [react-codemirror2](https://github.com/scniro/react-codemirror2): a tiny react codemirror component wrapper
- [react-color](https://github.com/casesandberg/react-color): A Collection of Color Pickers from Sketch, Photoshop, Chrome &amp; more
- [react-datepicker](https://github.com/Hacker0x01/react-datepicker): A simple and reusable datepicker component for React
- [react-dom](https://github.com/facebook/react): React package for working with the DOM.
- [react-dropzone](https://github.com/react-dropzone/react-dropzone): Simple HTML5 drag-drop zone with React.js
- [react-form](https://github.com/react-tools/react-form): React Form is a lightweight framework and utility for building powerful forms in React applications.
- [react-modal](https://github.com/reactjs/react-modal): Accessible modal dialog component for React.JS
- [react-redux](https://github.com/reactjs/react-redux): Official React bindings for Redux
- [react-redux-toastr](https://github.com/diegoddox/react-redux-toastr): react-redux-toastr is a React toastr message implemented with Redux
- [react-router](https://github.com/ReactTraining/react-router): A complete routing library for React
- [react-router-redux](https://github.com/reactjs/react-router-redux): Ruthlessly simple bindings to keep react-router and redux in sync
- [react-select](https://github.com/JedWatson/react-select): A Select control built with and for ReactJS
- [react-textarea-autosize](https://github.com/andreypopp/react-textarea-autosize): textarea component for React which grows with content
- [redux](https://github.com/reactjs/redux): Predictable state container for JavaScript apps
- [redux-auth-wrapper](https://github.com/mjrussell/redux-auth-wrapper): A utility library for handling authentication and authorization for redux and react-router
- [redux-i18n](https://github.com/APSL/redux-i18n): A simple and powerful package for translate your react applications.
- [reselect](https://github.com/reactjs/reselect): Selectors for Redux.
- [scholar-draft](https://github.com/peritext/scholar-draft): draft editor handling footnotes editing and inline/block assets connected to upstream logic
- [uuid](https://github.com/kelektiv/node-uuid): RFC4122 (v1, v4, and v5) UUIDs

## Dev Dependencies

- [@robindemourat/eslint-config](https://github.com/robindemourat/eslint-config): Just an eslint config.
- [babel-core](https://github.com/babel/babel/tree/master/packages): Babel compiler core.
- [babel-eslint](https://github.com/babel/babel-eslint): Custom parser for ESLint
- [babel-plugin-transform-class-properties](https://github.com/babel/babel/tree/master/packages): This plugin transforms static class properties as well as properties declared with the property initializer syntax
- [babel-plugin-transform-decorators](https://github.com/babel/babel/tree/master/packages): Compile class and object decorators to ES5
- [babel-plugin-transform-decorators-legacy](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy): A plugin for Babel 6 that (mostly) replicates the old decorator behavior from Babel 5.
- [babel-plugin-transform-object-rest-spread](https://github.com/babel/babel/tree/master/packages): Compile object rest and spread to ES5
- [babel-preset-es2015](https://github.com/babel/babel/tree/master/packages): Babel preset for all es2015 plugins.
- [babel-preset-react](https://github.com/babel/babel/tree/master/packages): Babel preset for all React plugins.
- [babel-template](https://github.com/babel/babel/tree/master/packages): Generate an AST from a string template.
- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [colors](https://github.com/Marak/colors.js): get colors in your node.js console
- [css-loader](https://github.com/webpack/css-loader): css loader module for webpack
- [csscomb](https://github.com/csscomb/csscomb.js): CSS coding style formatter
- [enzyme](https://github.com/airbnb/enzyme): JavaScript Testing utilities for React
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react): React specific linting rules for ESLint
- [file-loader](https://github.com/webpack/file-loader): file loader module for webpack
- [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader): Image loader module for webpack
- [kotatsu](https://github.com/Yomguithereal/kotatsu): Straightforward command line tool to setup a development environment for modern JavaScript.
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [node-sass](https://github.com/sass/node-sass): Wrapper around libsass
- [optimist](https://github.com/substack/node-optimist): Light-weight option parsing with an argv hash. No optstrings attached.
- [pre-commit](https://github.com/observing/pre-commit): Automatically install pre-commit hooks for your npm modules.
- [raw-loader](https://github.com/webpack/raw-loader): raw loader module for webpack
- [react-addons-test-utils](https://github.com/facebook/react): This package provides the React TestUtils add-on.
- [sass-loader](https://github.com/webpack-contrib/sass-loader): Sass loader for webpack
- [style-loader](https://github.com/webpack/style-loader): style loader module for webpack
- [uglify-es](https://github.com/mishoo/UglifyJS2): JavaScript parser, mangler/compressor and beautifier toolkit for ES6+
- [uglifyjs-webpack-plugin](https://github.com/webpack-contrib/uglifyjs-webpack-plugin): UglifyJS plugin for webpack
- [webpack](https://github.com/webpack/webpack): Packs CommonJs/AMD modules for the browser. Allows to split your codebase into multiple bundles, which can be loaded on demand. Support loaders to preprocess files, i.e. json, jsx, es7, css, less, ... and your custom stuff.
- [wrench](https://github.com/ryanmcgrath/wrench-js): Recursive filesystem (and other) operations that Node *should* have.


## Licenses

LGPL-3.0
CECCIL-C