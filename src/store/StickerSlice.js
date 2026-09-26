import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import initialStickersData from '../data/picsartStickers.json';

const API_BASE = 'http://localhost:5000/api/stickers';

// 1. Fetch all stickers (From Express API or fallback to local dataset)
export const fetchStickers = createAsyncThunk('stickers/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch(API_BASE);
    if (res.ok) {
      const data = await res.json();
      if (data && data.stickers && data.stickers.length > 0) {
        return data.stickers;
      }
    }
    // Fallback to local dataset
    return initialStickersData;
  } catch (err) {
    console.warn('Backend server not reachable, using local PicsArt dataset.', err.message);
    return initialStickersData;
  }
});

// 2. Add new sticker
export const addSticker = createAsyncThunk('stickers/add', async (newSticker) => {
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSticker),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Local fallback
  }
  return {
    id: `custom-${Date.now()}`,
    ...newSticker,
  };
});

// 3. Update sticker
export const updateSticker = createAsyncThunk('stickers/update', async ({ id, updatedData }) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (res.ok) {
      const data = await res.json();
      return data.data;
    }
  } catch {
    // Local fallback
  }
  return { id, ...updatedData };
});

// 4. Delete sticker
export const deleteSticker = createAsyncThunk('stickers/delete', async (id) => {
  try {
    await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  } catch {
    // Local fallback
  }
  return id;
});

// 5. Live Scrape from PicsArt
export const scrapePicsartCategory = createAsyncThunk('stickers/scrape', async (category, { rejectWithValue }) => {
  try {
    const res = await fetch(`${API_BASE}/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category }),
    });
    const data = await res.json();
    if (data.success && data.stickers) {
      return data.stickers;
    }
    return rejectWithValue(data.message || 'Scraping failed');
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const initialState = {
  items: initialStickersData || [],
  filteredItems: initialStickersData || [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  currentPage: 1,
  itemsPerPage: 16,
  isScraping: false,
};

const stickerSlice = createSlice({
  name: 'stickers',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      stickerSlice.caseReducers.applyFilters(state);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      stickerSlice.caseReducers.applyFilters(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    applyFilters: (state) => {
      state.filteredItems = state.items.filter((item) => {
        const matchesSearch =
          (item.name && item.name.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
          (item.category && item.category.toLowerCase().includes(state.searchTerm.toLowerCase()));
        const matchesCategory =
          state.selectedCategory === 'All' ||
          (item.category && item.category.toLowerCase() === state.selectedCategory.toLowerCase());
        return matchesSearch && matchesCategory;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchStickers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStickers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.currentPage = 1;
      })
      .addCase(fetchStickers.rejected, (state, action) => {
        state.status = 'succeeded'; // fallback to initial
        state.error = action.error.message;
      })
      // Add
      .addCase(addSticker.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        stickerSlice.caseReducers.applyFilters(state);
      })
      // Update
      .addCase(updateSticker.fulfilled, (state, action) => {
        const index = state.items.findIndex((s) => String(s.id) === String(action.payload.id));
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        stickerSlice.caseReducers.applyFilters(state);
      })
      // Delete
      .addCase(deleteSticker.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => String(s.id) !== String(action.payload));
        stickerSlice.caseReducers.applyFilters(state);
      })
      // Scrape
      .addCase(scrapePicsartCategory.pending, (state) => {
        state.isScraping = true;
      })
      .addCase(scrapePicsartCategory.fulfilled, (state, action) => {
        state.isScraping = false;
        const existingUrls = new Set(state.items.map((s) => s.url));
        const newItems = action.payload.filter((s) => !existingUrls.has(s.url));
        state.items = [...newItems, ...state.items];
        stickerSlice.caseReducers.applyFilters(state);
      })
      .addCase(scrapePicsartCategory.rejected, (state, action) => {
        state.isScraping = false;
        state.error = action.payload || 'Failed to scrape PicsArt';
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage } = stickerSlice.actions;
export default stickerSlice.reducer;
