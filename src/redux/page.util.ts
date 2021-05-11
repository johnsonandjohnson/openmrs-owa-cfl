export const DEFAULT_PAGE_SIZE = 50;

export const pageOf = (entities, currentPage, pageSize = DEFAULT_PAGE_SIZE) =>
  !!entities ? entities.slice(currentPage * pageSize, (currentPage + 1) * pageSize) : [];
