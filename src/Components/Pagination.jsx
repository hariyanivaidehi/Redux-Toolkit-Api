import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPage } from '../store/StickerSlice';

export default function Pagination() {
  const dispatch = useDispatch();
  const { filteredItems, currentPage, itemsPerPage } = useSelector(
    (state) => state.stickers || state.products
  );

  const totalPages = Math.ceil((filteredItems ? filteredItems.length : 0) / itemsPerPage);

  if (totalPages <= 1) return null;

  // Calculate visible page numbers
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-1.5 mt-10 pt-6 border-t border-slate-200">
      {/* Less than < Button */}
      <button
        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        disabled={currentPage === 1}
        title="Previous Page"
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
      >
        &lt;
      </button>

      {/* First Page */}
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => dispatch(setCurrentPage(1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm"
          >
            1
          </button>
          {pageNumbers[0] > 2 && <span className="px-1 text-slate-400 text-xs">...</span>}
        </>
      )}

      {/* Number Buttons */}
      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => dispatch(setCurrentPage(num))}
          className={`w-9 h-9 flex items-center justify-center rounded-xl font-bold text-xs transition shadow-sm active:scale-95 ${
            currentPage === num
              ? 'bg-indigo-600 text-white shadow-indigo-200 ring-2 ring-indigo-600 ring-offset-2'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {num}
        </button>
      ))}

      {/* Last Page */}
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-xs">...</span>
          )}
          <button
            onClick={() => dispatch(setCurrentPage(totalPages))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition shadow-sm"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Greater than > Button */}
      <button
        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        disabled={currentPage === totalPages}
        title="Next Page"
        className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
      >
        &gt;
      </button>
    </div>
  );
}