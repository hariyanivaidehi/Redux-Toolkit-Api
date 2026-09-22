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

  return (
    <div className="flex justify-center items-center gap-2 mt-10 pt-6 border-t border-slate-200">
      <button
        onClick={() => dispatch(setCurrentPage(currentPage - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
      >
        ← Prev
      </button>

      <div className="flex items-center gap-1.5 px-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Page
        </span>
        <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-sm shadow-indigo-200">
          {currentPage}
        </span>
        <span className="text-xs font-semibold text-slate-400">
          of {totalPages}
        </span>
      </div>

      <button
        onClick={() => dispatch(setCurrentPage(currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm"
      >
        Next →
      </button>
    </div>
  );
}