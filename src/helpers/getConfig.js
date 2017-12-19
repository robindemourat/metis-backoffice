import devConfig from '../../config.dev';
import prodConfig from '../../config.prod';

/**
 * @return {object} config - prod or dev config
 */
export default function getConfig() {
  return process.env.NODE_ENV === 'production' ?
           prodConfig : devConfig;
}
