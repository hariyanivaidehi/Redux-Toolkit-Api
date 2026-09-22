import { configureStore } from '@reduxjs/toolkit';
import stickerReducer from './StickerSlice';

export const store = configureStore({
  reducer: {
    stickers: stickerReducer,
    // Alias for backward compatibility
    products: stickerReducer,
  },
});