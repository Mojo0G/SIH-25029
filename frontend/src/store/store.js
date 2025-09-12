import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,
  },
});

export default store;
