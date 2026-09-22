import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStickers, setSearchTerm, setSelectedCategory } from './store/StickerSlice';
import StickerCard from './Components/StickerCard';
import StickerModal from './Components/StickerModal';
import Pagination from './Components/Pagination';

export default function App() {
  const dispatch = useDispatch();
  const { filteredItems, items, status, error, searchTerm, selectedCategory, currentPage, itemsPerPage } = useSelector(
    (state) => state.stickers
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSticker, setEditingSticker] = useState(null);

  useEffect(() => {
    dispatch(fetchStickers());
  }, [dispatch]);

  const handleOpenAddModal = () => {
    setEditingSticker(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sticker) => {
    setEditingSticker(sticker);
    setIsModalOpen(true);
  };

  // Dynamically get unique categories from stickers
  const categories = useMemo(() => {
    const cats = new Set(items.map((s) => s.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [items]);

  // Pagination slice
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">✨</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Sticker<span className="text-indigo-600">Hub</span>
            </span>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-2xl font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 transition active:scale-95"
          >
            + Add Sticker
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
        {/* Filter & Search Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-4 lg:gap-5 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[280px] lg:max-w-xl">
            <span className="absolute left-4 top-3.5 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              placeholder="Search stickers by name or category..."
              value={searchTerm}
              onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              className="w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm placeholder:text-slate-400 transition"
            />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0 scroll-smooth">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => dispatch(setSelectedCategory(cat))}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition whitespace-nowrap active:scale-95 ${
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
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
            <p className="text-slate-500 mt-4 text-xs font-medium">Loading stickers...</p>
          </div>
        )}

        {/* Error State */}
        {status === 'failed' && (
          <div className="bg-red-50 text-red-700 p-6 rounded-3xl text-center border border-red-200">
            <p className="font-bold text-sm">❌ Connection Error: {error}</p>
            <p className="text-xs mt-1">Unable to load stickers. Please check your network connection.</p>
          </div>
        )}

        {/* Stickers Grid */}
        {status !== 'loading' && (
          <div>
            {filteredItems.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <span className="text-4xl">🎨</span>
                <h3 className="text-base font-bold text-slate-700 mt-3">No Stickers Found</h3>
                <p className="text-slate-400 text-xs mt-1">Try changing your search keyword or category filter.</p>
                <button
                  onClick={handleOpenAddModal}
                  className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md shadow-indigo-200 transition"
                >
                  + Add Sticker
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4">
                  {paginatedItems.map((sticker) => (
                    <StickerCard key={sticker.id} sticker={sticker} onEdit={handleOpenEditModal} />
                  ))}
                </div>
                <Pagination />
              </>
            )}
          </div>
        )}
      </main>

      {/* Modal for Add / Edit */}
      <StickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editSticker={editingSticker}
      />
    </div>
  );
}