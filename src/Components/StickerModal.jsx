import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addSticker, updateSticker } from '../store/StickerSlice';

export default function StickerModal({ isOpen, onClose, editSticker }) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    category: 'aesthetic',
    url: '',
  });

  useEffect(() => {
    if (editSticker) {
      setFormData(editSticker);
    } else {
      setFormData({
        name: '',
        category: 'aesthetic',
        url: '',
      });
    }
  }, [editSticker, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editSticker) {
      dispatch(updateSticker({ id: editSticker.id, updatedData: formData }));
    } else {
      dispatch(addSticker(formData));
    }
    onClose();
  };

  const categories = ['aesthetic', 'vintage', 'butterfly', 'cute', 'flower', 'y2k', 'neon', 'anime', 'love'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-7 relative max-h-[90vh] overflow-y-auto no-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
          {editSticker ? '✏️ Edit Sticker' : '✨ Add Sticker'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Sticker Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Butterfly Dream"
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
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
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
              Sticker Image URL (PNG / WebP) *
            </label>
            <input
              type="url"
              required
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm transition"
            />
          </div>

          {/* Live Preview */}
          {formData.url && (
            <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-200">
              <p className="text-[11px] text-slate-400 mb-1 font-medium">Image Preview</p>
              <img
                src={formData.url}
                alt="Preview"
                className="max-h-28 object-contain drop-shadow-md"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-200 text-xs transition active:scale-95"
            >
              {editSticker ? 'Save Changes' : 'Add Sticker'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
