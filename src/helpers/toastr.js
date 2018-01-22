/**
 * This module exports a function that converts
 * a logic-based status related to an http request
 * into a toastr-compatible status
 * @module metis-frontoffice/utils/toastr
 */

export const buildOperationToastr = ({operation, status, translations = {}}) => {
  let type;
  switch (status) {
    case 'success':
      type = 'success';
      break;
    case 'error':
      type = 'error';
      break;
    case 'requesting':
    default:
      type = 'info';
      break;
  }

  return {
    type,
    title: operation,
    message: translations[type] || type
  };
};
