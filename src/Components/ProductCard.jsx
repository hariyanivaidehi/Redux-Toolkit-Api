import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteProduct } from '../store/ProductSlice';

export default function ProductCard({ product, onEdit }) {
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${product.title}"?`)) {
      dispatch(deleteProduct(product.id));
    }
  };

  return (
    <div className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col justify-between relative overflow-hidden">
      {/* Image & Badge */}
      <div className="relative h-48 w-full bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center p-3 mb-4">
        <img
          src={product.thumbnail || 'https://via.placeholder.com/300'}
          alt={product.title}
          className="max-h-full object-contain group-hover:scale-108 transition-transform duration-300"
        />
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-indigo-600 font-bold text-xs px-2.5 py-1 rounded-full shadow-sm">
          {product.category}
        </span>
        <span className="absolute top-3 right-3 bg-amber-400/90 backdrop-blur-md text-white font-bold text-xs px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
          ★ {product.rating}
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-col flex-grow">
        <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2 leading-relaxed">
          {product.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xs text-gray-400 block font-medium">Price</span>
            <span className="text-2xl font-black text-gray-900">${product.price}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 block font-medium">Stock</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {product.stock} left
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons (Edit / Delete) */}
      <div className="mt-5 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <button
          onClick={() => onEdit(product)}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold text-xs transition duration-200"
        >
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white font-semibold text-xs transition duration-200"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}