import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../store/ProductSlice';

export default function SearchBar() {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.products.searchTerm);

  return (
    <div className="mb-6 max-w-md mx-auto">
      <input
        type="text"
        placeholder="🔍 Search products or category..."
        value={searchTerm}
        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
      />
    </div>
  );
}