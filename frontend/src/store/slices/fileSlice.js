import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  files: [],
  isUploading: false,
  uploadProgress: 0,
};

const fileSlice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    addFile: (state, action) => {
      // Only allow one image file - replace existing if any
      state.files = [action.payload];
    },
    removeFile: (state, action) => {
      state.files = state.files.filter((_, index) => index !== action.payload);
    },
    clearFiles: (state) => {
      state.files = [];
    },
    setFiles: (state, action) => {
      state.files = action.payload;
    },
    setUploading: (state, action) => {
      state.isUploading = action.payload;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
  },
});

export const {
  addFile,
  removeFile,
  clearFiles,
  setFiles,
  setUploading,
  setUploadProgress,
} = fileSlice.actions;

export default fileSlice.reducer;
