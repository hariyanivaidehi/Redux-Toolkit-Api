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

  const handleDownload = async () => {
    try {
      const response = await fetch(sticker.url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${sticker.name || 'sticker'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(sticker.url, '_blank');
    }
  };

  const categoryColors = {
    aesthetic: 'bg-pink-50 text-pink-600 border-pink-100',
    vintage: 'bg-amber-50 text-amber-700 border-amber-100',
    butterfly: 'bg-purple-50 text-purple-600 border-purple-100',
    cute: 'bg-rose-50 text-rose-600 border-rose-100',
    flower: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    y2k: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  };

  const catKey = (sticker.category || '').toLowerCase();
  const badgeStyle = categoryColors[catKey] || 'bg-indigo-50 text-indigo-600 border-indigo-100';

  return (
    <div className="group bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Category Pill */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle} capitalize tracking-wide`}>
          {sticker.category || 'Sticker'}
        </span>
      </div>

      {/* Transparent Canvas Preview */}
      <div className="relative h-36 sm:h-40 w-full bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:10px_10px] bg-slate-50/70 rounded-xl overflow-hidden flex items-center justify-center p-3">
        <img
          src={sticker.url || 'https://via.placeholder.com/200?text=Sticker'}
          alt={sticker.name}
          loading="lazy"
          className="max-h-full max-w-full object-contain drop-shadow-md group-hover:scale-110 group-hover:rotate-1 transition-transform duration-300"
        />
      </div>

      {/* Details & Actions */}
      <div className="mt-2.5">
        <h3 className="font-bold text-slate-800 text-xs line-clamp-1 group-hover:text-indigo-600 transition-colors mb-2">
          {sticker.name || 'Sticker'}
        </h3>

        {/* Clean Action Icons Row */}
        <div className="flex items-center justify-between gap-1 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              title={copied ? "Copied Link!" : "Copy Link"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs transition active:scale-95 ${
                copied ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {copied ? '✓' : '🔗'}
            </button>
            <button
              onClick={handleDownload}
              title="Download Sticker PNG"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white transition active:scale-95"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(sticker)}
              title="Edit Sticker"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs transition active:scale-95"
            >
              ✏️
            </button>
            <button
              onClick={handleDelete}
              title="Delete Sticker"
              className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-500 text-red-500 hover:text-white text-xs transition active:scale-95"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
