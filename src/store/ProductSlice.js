import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://dummyjson.com/products';

// 1. GET (Read 100 products directly from Public API)
export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const response = await fetch(`${API_URL}?limit=100`);
  const data = await response.json();
  return data.products.map((item) => ({
    ...item,
    category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'General'
  }));
});

// 2. POST (Add new product)
export const addProduct = createAsyncThunk('products/add', async (newProduct) => {
  const response = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });
  const data = await response.json();
  return {
    ...data,
    id: data.id || Date.now(),
    category: data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'General'
  };
});

// 3. PUT (Update product)
export const updateProduct = createAsyncThunk('products/update', async ({ id, updatedData }) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedData),
  });
  const data = await response.json();
  return {
    ...data,
    category: data.category ? data.category.charAt(0).toUpperCase() + data.category.slice(1) : 'General'
  };
});

// 4. DELETE (Delete product)
export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  return id;
});

const initialState = {
  items: [],
  filteredItems: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  searchTerm: '',
  selectedCategory: 'All',
  currentPage: 1,
  itemsPerPage: 8,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
      productSlice.caseReducers.applyFilters(state);
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
      productSlice.caseReducers.applyFilters(state);
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    applyFilters: (state) => {
      state.filteredItems = state.items.filter((item) => {
        const matchesSearch =
          (item.title && item.title.toLowerCase().includes(state.searchTerm.toLowerCase())) ||
          (item.description && item.description.toLowerCase().includes(state.searchTerm.toLowerCase()));
        const matchesCategory =
          state.selectedCategory === 'All' || item.category.toLowerCase() === state.selectedCategory.toLowerCase();
        return matchesSearch && matchesCategory;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.filteredItems = action.payload;
        state.currentPage = 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
        productSlice.caseReducers.applyFilters(state);
      })
      // Update
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        productSlice.caseReducers.applyFilters(state);
      })
      // Delete
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        productSlice.caseReducers.applyFilters(state);
      });
  },
});

export const { setSearchTerm, setSelectedCategory, setCurrentPage } = productSlice.actions;
export default productSlice.reducer;