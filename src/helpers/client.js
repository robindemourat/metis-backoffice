/**
 * Metis backoffice Application
 * =======================================
 * Axios client wrapper - plugged directly to the config file specifying api endpoints
 * @module metis-backoffice
 */

import axios from 'axios';

import getConfig from './getConfig';
const config = getConfig();
// const config = require('../../config');
const {
  apiBaseUri,
  endpoints
} = config;

const client = {
  settings: {
    baseUrl: apiBaseUri
  },
  endpoints
};

const buildEndpoint = (endpoint, options = {}) => {
  if (options.id) {
    const id = encodeURIComponent(options.id);
    delete options.id;
    return `${client.settings.baseUrl}${client.endpoints[endpoint]}/${id}`;
  }
  return `${client.settings.baseUrl}${client.endpoints[endpoint]}`;
};

const buildOptions = (options = {}) => {
  const token = localStorage.getItem('token');
  return {
    ...options,
    headers: {
        ...options.headers,
        'x-access-token': token,
    },
  };
};

export const get = (endpoint, options = {params: {}}) =>
  axios.get(buildEndpoint(endpoint, options), buildOptions(options));

export const post = (endpoint, options = {params: {}}, body) =>
  axios.post(buildEndpoint(endpoint, options), body, buildOptions(options));

export const put = (endpoint, options = {params: {}}, body) => {
  return axios.put(buildEndpoint(endpoint, options), body, buildOptions(options));
};

export const del = (endpoint, options = {params: {}}) =>
  axios.delete(buildEndpoint(endpoint, options), buildOptions(options));
