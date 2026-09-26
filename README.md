# ✨ StickerHub - Sticker Management & Exploration Platform

A modern, full-screen React & Redux Toolkit web application for exploring, searching, and managing high-resolution stickers with category filtering, pagination, and complete CRUD operations.

---

## ✨ Features

- 🎨 **Rich Sticker Collection**: 168+ high-resolution transparent PNG stickers across diverse categories (`Aesthetic`, `Vintage`, `Butterfly`, `Cute`, `Flower`, `Neon`, etc.).
- ⚡ **Redux Toolkit State Management**: Global state management powered by `@reduxjs/toolkit` and `react-redux` with async thunks for data fetching and mutations.
- 🔍 **Instant Real-Time Search**: Search stickers dynamically by name or category.
- 🏷️ **Dynamic Category Filtering**: Interactive category pills for fast, categorized browsing.
- 📄 **Modern Pagination**: Smooth pagination with `<` and `>` arrow controls and page navigation.
- 🔗 **Quick Actions**: One-click sticker PNG download, copy image link to clipboard, edit sticker details, and delete stickers.
- 🖥️ **Full-Screen Responsive UI**: Built with Tailwind CSS v4, featuring a fluid 8-column layout, glassmorphism header, and subtle animations.
- 🛠️ **Node.js Express REST API**: Backend server providing RESTful endpoints for sticker management.

---

## 🚀 Getting Started

### 1. Run the Express Backend Server (Optional)
```bash
node server/index.js
```
*(Server runs on `http://localhost:5000`)*

### 2. Run the React Frontend
```bash
npm install
npm run dev
```
*(Frontend runs on `http://localhost:5173/`)*

### 3. Build for Production
```bash
npm run build
```

---

## 📡 API Endpoints

- `GET /api/stickers` — Fetch all stickers (supports `?category=` and `?search=`)
- `POST /api/stickers` — Add a new custom sticker
- `PUT /api/stickers/:id` — Update an existing sticker
- `DELETE /api/stickers/:id` — Delete a sticker

---

## 🛠️ Tech Stack

- **React 19**
- **Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)**
- **Vite**
- **Tailwind CSS v4**
- **Node.js + Express REST API**
