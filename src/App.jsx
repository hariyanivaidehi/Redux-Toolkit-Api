import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setSearchTerm, setSelectedCategory } from './store/ProductSlice';
import ProductCard from './Components/ProductCard';
import ProductModal from './Components/ProductModal';
import Pagination from './Components/Pagination';

export default function App() {
  const dispatch = useDispatch();
  const { filteredItems, items, status, error, searchTerm, selectedCategory, currentPage, itemsPerPage } = useSelector(
    (state) => state.products
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // Dynamically get all unique categories from products
  const categories = useMemo(() => {
    const cats = new Set(items.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Product<span className="text-indigo-600">Store</span>
            </span>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95"
          >
            + Add Product
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-5 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[320px] lg:max-w-2xl">
            <span className="absolute left-4 top-3.5 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              placeholder="Search products by title or description..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm md:text-base placeholder:text-slate-400 transition"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => dispatch(setSelectedCategory(cat))}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {status === 'loading' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 mt-4 text-sm font-medium">Loading products from API...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl text-center border border-red-200">
            <p className="font-bold">❌ API Connection Error: {error}</p>
            <p className="text-xs mt-1">Unable to fetch products. Please check your internet connection.</p>
          </div>
        )}

        {/* Products Grid */}
        {status === 'succeeded' && (
          <div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <span className="text-4xl">📦</span>
                <h3 className="text-lg font-bold text-slate-700 mt-3">No Products Found</h3>
                <p className="text-slate-400 text-sm mt-1">Try changing your search term or add a new product.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {paginatedItems.map((product) => (
                    <ProductCard key={product.id} product={product} onEdit={handleOpenEditModal} />
                  ))}
                </div>
                <Pagination />
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal for Add / Edit */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editProduct={editingProduct}
      />
    </div>
  );
}