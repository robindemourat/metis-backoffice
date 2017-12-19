

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
