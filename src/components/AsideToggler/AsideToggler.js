/**
 * This module prplurishing-backoffices a aside toggler element component
 * Sets the mode of an aside ui column
 * @module plurishing-backoffice/components/AsideToggler
 */
import React from 'react';
import PropTypes from 'prop-types';

import './AsideToggler.scss';


/**
 * Renders the AsideToggler component as a pure function
 * @param {object} props - used props (see prop types below)
 * @return {ReactElement} component - the resulting component
 */
const AsideToggler = ({
  options = [],
  setOption,
  activeOption,
}) => {
  return (
    <ul className="plurishing-backoffice-AsideToggler">
      {
        options.map((option, index) => {
          const onClick = () => {
            setOption(option.id);
          };
          return (
            <li
              className={'option' + (activeOption === option.id ? ' active' : '')}
              onClick={onClick}
              key={index}>
              <span>{option.name}</span>
            </li>
          );
        })
      }
    </ul>
  );
};

/**
 * Component's properties types
 */
AsideToggler.propTypes = {

  /**
   * Side column available options
   */
  options: PropTypes.array,

  /**
   * Id of the active option
   */
  activeOption: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),

  /**
   * Whether nav buttons are hidden
   */
  hideNav: PropTypes.bool,

  /**
   * Callbacks an option choice
   */
  setOption: PropTypes.func,
};

export default AsideToggler;
