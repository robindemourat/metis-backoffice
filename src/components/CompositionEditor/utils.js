

export const resourceToCslJSON = resource => {

  const type = resource.metadata.ressource_type;
  let cslType;
  if (type === 'bib') {
    return resource.data;
  }
  switch (type) {
    case 'video':
      cslType = 'broadcast';
      break;
    case 'data-presentation':
      cslType = 'dataset';
      break;
    case 'iframe':
      cslType = 'webpage';
      break;
    case 'table':
      cslType = 'dataset';
      break;
    case 'image':
    case 'imagegallery':
      cslType = 'graphic';
      break;
    default:
      cslType = 'misc';
      break;
  }
  return {
    type: cslType,
    title: resource.metadata.title,
    id: resource._id,
    abstract: resource.metadata.description,
    issued: resource.metadata.date && {raw: resource.metadata.date},
    author: (
              resource.metadata.creators &&
              Array.isArray(resource.metadata.creators) &&
              resource.metadata.creators.map(author => {
                if (typeof author === 'string') {
                  return {family: author};
                }
                return author;
              })
            ) || []
  };
};
