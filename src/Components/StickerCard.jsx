import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { deleteSticker } from '../store/StickerSlice';

export default function StickerCard({ sticker, onEdit }) {
  const dispatch = useDispatch();
  const [copied, setCopied] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${sticker.name}"?`)) {
      dispatch(deleteSticker(sticker.id));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(sticker.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryColors = {
    aesthetic: 'bg-pink-50 text-pink-600 border-pink-200',
    vintage: 'bg-amber-50 text-amber-700 border-amber-200',
    butterfly: 'bg-purple-50 text-purple-600 border-purple-200',
    cute: 'bg-rose-50 text-rose-600 border-rose-200',
    flower: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    y2k: 'bg-cyan-50 text-cyan-600 border-cyan-200',
  };

  const catKey = (sticker.category || '').toLowerCase();
  const badgeStyle = categoryColors[catKey] || 'bg-indigo-50 text-indigo-600 border-indigo-200';

  return (
    <div className="group bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Top badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${badgeStyle} capitalize`}>
          {sticker.category || 'Sticker'}
        </span>
        <button
          onClick={handleCopy}
          title="Copy Image URL"
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-2.5 py-1 rounded-lg transition active:scale-95"
        >
          {copied ? '✓ Copied' : '🔗 Copy URL'}
        </button>
      </div>

      {/* Transparent Canvas Preview */}
      <div className="relative h-48 w-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50/70 rounded-2xl overflow-hidden flex items-center justify-center p-4">
        <img
          src={sticker.url || 'https://via.placeholder.com/200?text=PicsArt+Sticker'}
          alt={sticker.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-2 transition-transform duration-300"
        />
      </div>

      {/* Details */}
      <div className="mt-3">
        <h3 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {sticker.name || 'PicsArt Sticker'}
        </h3>
      </div>

      {/* Actions (Download / Edit / Delete) */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={sticker.url}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex-1 text-center py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-semibold text-xs transition active:scale-95"
        >
          ⬇️ Download
        </a>
        <button
          onClick={() => onEdit(sticker)}
          title="Edit"
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs transition"
        >
          ✏️
        </button>
        <button
          onClick={handleDelete}
          title="Delete"
          className="p-2 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
