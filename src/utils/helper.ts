export const getVisiblePages = (totalPages: number, currentPage: number) => {
  if (totalPages <= 1) return [1];

  const nearbyCount = 2;
  const pages: (number | string)[] = [];

  pages.push(1);

  const startPage = Math.max(2, currentPage - nearbyCount);
  const endPage = Math.min(totalPages - 1, currentPage + nearbyCount);

  if (startPage > 2) {
    pages.push("...");
  }

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  if (endPage < totalPages - 1) {
    pages.push("...");
  }

  pages.push(totalPages);

  return pages;
};
