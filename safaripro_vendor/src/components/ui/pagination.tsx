// A utility function to generate the pagination range
const generatePagination = (currentPage, totalPages) => {
  // If there are 7 or fewer pages, show all of them
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 4, show 1, 2, 3, 4, 5, ..., totalPages
  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "...", totalPages];
  }

  // If the current page is among the last 4, show 1, ..., (totalPages - 4) ... totalPages
  if (currentPage >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Otherwise, show the current page with 2 pages on each side
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export const Pagination = ({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  const totalPages = Math.ceil(totalCount / pageSize);

  if (totalPages === 1) return null;

  const paginationRange = generatePagination(currentPage, totalPages);

  return (
    <div className="flex items-center justify-between px-4 py-4">
      <div className="flex items-center text-sm text-gray-700">
        <span>
          Page {currentPage} of {totalPages}
        </span>
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          // Updated styling for Prev button
          className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium rounded-full transition-colors  disabled:text-gray-400 disabled:cursor-not-allowed bg-[#E5E6FF] text-[#5A43D6] hover:bg-[#E5E6FF]"
        >
          Prev
        </button>

        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm">
                ...
              </span>
            );
          }

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              // Updated styling for page number buttons
              className={`px-[0.9375rem] text-[#5A43D6] py-[0.5rem] text-[0.875rem] font-medium rounded-full transition-colors ${
                currentPage === pageNumber
                  ? "bg-[#E5E6FF] text-[#5A43D6]  "
                  : "bg-white text-[#5A43D6] hover:bg-gray-100"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          // Updated styling for Next button
          className="px-[0.9375rem] py-[0.5rem] text-[0.875rem] font-medium rounded-full transition-colors  disabled:text-gray-400 disabled:cursor-not-allowed bg-[#E5E6FF] text-[#5A43D6] hover:bg-[#E5E6FF]"
        >
          Next
        </button>
      </div>
    </div>
  );
};
