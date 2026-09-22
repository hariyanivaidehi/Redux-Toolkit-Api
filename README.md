# 🎨 PicsArt Stickers Studio (React + Redux Toolkit + Scraper API)

A full-stack React & Redux Toolkit application for exploring, searching, and managing **PicsArt Editing Stickers** with live category scraping, offline fallback, and full CRUD operations.

## ✨ Features

- 🎨 **PicsArt Sticker Integration**: 170+ real high-resolution transparent PNG stickers across popular editing categories (`Aesthetic`, `Vintage`, `Butterfly`, `Cute`, `Flower`, `Y2K`, `Anime`, `Neon`, etc.).
- 🕷️ **Live PicsArt Web Scraper**: Scrape new stickers directly from `https://picsart.com/stickers/[category]` on-demand.
- ⚡ **Redux Toolkit State Management**: Async thunks for fetching, adding custom stickers, editing, deleting, and live scraping.
- 🔍 **Real-Time Search**: Search stickers instantly by name or category.
- 🏷️ **Dynamic Category Filtering**: Category pills extracted dynamically from sticker data.
- 📄 **Pagination**: Responsive pagination with clean controls.
- 🔗 **Copy URL & Download**: Instant PNG download and copy image URL to clipboard.
- 🛠️ **Node.js Express Server**: REST API with endpoints `/api/stickers` and `/api/stickers/scrape`.

---

## 🚀 Getting Started

### 1. Run the Express Backend Server (Optional for live scraping & server persistence)
```bash
node server/index.js
```
*(Server runs on `http://localhost:5000`)*

### 2. Run the React Frontend
```bash
npm install
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📡 API Endpoints

- `GET /api/stickers` — List all stickers (supports `?category=` and `?search=`)
- `POST /api/stickers` — Add new custom sticker
- `PUT /api/stickers/:id` — Update sticker details
- `DELETE /api/stickers/:id` — Delete sticker
- `POST /api/stickers/scrape` — Live scrape stickers from PicsArt (`{ category: "vintage" }`)

---

## 🛠️ Tech Stack
- **React 19**
- **Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)**
- **Vite**
- **Tailwind CSS v4**
- **Express + Node.js (Live PicsArt Web Scraper)**
