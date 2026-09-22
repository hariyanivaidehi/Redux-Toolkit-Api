import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSticker, updateSticker, scrapePicsartCategory } from '../store/StickerSlice';

export default function StickerModal({ isOpen, onClose, editSticker }) {
  const dispatch = useDispatch();
  const { isScraping } = useSelector((state) => state.stickers);

  const [activeTab, setActiveTab] = useState('manual'); // 'manual' | 'scrape'
  const [scrapeQuery, setScrapeQuery] = useState('aesthetic');
  const [scrapeSuccessMsg, setScrapeSuccessMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    category: 'aesthetic',
    url: '',
  });

  useEffect(() => {
    if (editSticker) {
      setFormData(editSticker);
      setActiveTab('manual');
    } else {
      setFormData({
        name: '',
        category: 'aesthetic',
        url: '',
      });
    }
    setScrapeSuccessMsg('');
  }, [editSticker, isOpen]);

  if (!isOpen) return null;

  const handleSubmitManual = (e) => {
    e.preventDefault();
    if (editSticker) {
      dispatch(updateSticker({ id: editSticker.id, updatedData: formData }));
    } else {
      dispatch(addSticker(formData));
    }
    onClose();
  };

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!scrapeQuery.trim()) return;
    setScrapeSuccessMsg('');
    const res = await dispatch(scrapePicsartCategory(scrapeQuery.trim()));
    if (res.meta.requestStatus === 'fulfilled') {
      setScrapeSuccessMsg(`🎉 Successfully scraped and imported stickers for "${scrapeQuery}"!`);
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  const categories = ['aesthetic', 'vintage', 'butterfly', 'cute', 'flower', 'y2k', 'neon', 'anime', 'love'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition"
        >
          ✕
        </button>

        {/* Tabs */}
        {!editSticker && (
          <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              onClick={() => setActiveTab('manual')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ✍️ Add Sticker
            </button>
            <button
              onClick={() => setActiveTab('scrape')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'scrape' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🕷️ Live PicsArt Scraper
            </button>
          </div>
        )}

        {/* Manual Tab / Edit */}
        {activeTab === 'manual' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              {editSticker ? '✏️ Edit Sticker' : '🎨 Add New Sticker'}
            </h2>

            <form onSubmit={handleSubmitManual} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Sticker Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Vintage Butterfly #1"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm capitalize transition"
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Sticker Image URL (PNG/WebP) *
                </label>
                <input
                  type="url"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://pastatic.picsart.com/...png"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition"
                />
              </div>

              {/* Live Preview */}
              {formData.url && (
                <div className="p-4 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-200">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Image Preview</p>
                  <img
                    src={formData.url}
                    alt="Preview"
                    className="max-h-32 object-contain drop-shadow-md"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-200 text-sm transition"
                >
                  {editSticker ? 'Save Changes' : 'Create Sticker'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Scraper Tab */}
        {activeTab === 'scrape' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              🕷️ Scrape PicsArt Live
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Enter any keyword or category to scrape stickers directly from <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600 font-semibold">https://picsart.com/stickers/[category]</code>!
            </p>

            <form onSubmit={handleScrape} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  PicsArt Category / Keyword
                </label>
                <input
                  type="text"
                  required
                  value={scrapeQuery}
                  onChange={(e) => setScrapeQuery(e.target.value)}
                  placeholder="e.g. vintage, anime, aesthetic, butterfly, neon, cyber"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition"
                />
              </div>

              {/* Suggestions */}
              <div>
                <p className="text-xs text-slate-400 mb-2 font-medium">Quick suggestions:</p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setScrapeQuery(cat)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-[11px] font-semibold text-slate-600 transition"
                    >
                      +{cat}
                    </button>
                  ))}
                </div>
              </div>

              {scrapeSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-medium border border-emerald-200">
                  {scrapeSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 text-sm transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isScraping}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold shadow-lg shadow-indigo-200 text-sm transition flex items-center gap-2"
                >
                  {isScraping ? (
                    <>
                      <span className="animate-spin text-sm">⏳</span>
                      Scraping PicsArt...
                    </>
                  ) : (
                    '🚀 Start Scraping'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
