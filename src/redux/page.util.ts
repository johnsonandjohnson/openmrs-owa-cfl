export const DEFAULT_PAGE_SIZE = 100;

export const pageOf = (entities, currentPage, pageSize = DEFAULT_PAGE_SIZE) => {
  return !!entities
    ? entities.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
    : [];
};
