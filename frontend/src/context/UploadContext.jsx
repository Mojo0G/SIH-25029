import React, { createContext, useContext, useReducer } from 'react';

const UploadContext = createContext();

const initialState = {
  files: [],
  isUploading: false,
  uploadProgress: 0,
  results: [],
  isAnalyzing: false,
  analysisComplete: false,
  error: null,
};

const uploadReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FILES':
      return { ...state, files: action.payload, error: null };
    case 'ADD_FILES':
      return { ...state, files: [...state.files, ...action.payload], error: null };
    case 'REMOVE_FILE':
      return { 
        ...state, 
        files: state.files.filter((_, index) => index !== action.payload),
        error: null 
      };
    case 'CLEAR_FILES':
      return { ...state, files: [], error: null };
    case 'SET_UPLOADING':
      return { ...state, isUploading: action.payload, error: null };
    case 'SET_PROGRESS':
      return { ...state, uploadProgress: action.payload };
    case 'SET_RESULTS':
      return { ...state, results: action.payload, analysisComplete: true, isAnalyzing: false };
    case 'ADD_RESULT':
      return { ...state, results: [...state.results, action.payload] };
    case 'SET_ANALYZING':
      return { ...state, isAnalyzing: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isUploading: false, isAnalyzing: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const UploadProvider = ({ children }) => {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const setFiles = (files) => dispatch({ type: 'SET_FILES', payload: files });
  const addFiles = (files) => dispatch({ type: 'ADD_FILES', payload: files });
  const removeFile = (index) => dispatch({ type: 'REMOVE_FILE', payload: index });
  const clearFiles = () => dispatch({ type: 'CLEAR_FILES' });
  const setUploading = (isUploading) => dispatch({ type: 'SET_UPLOADING', payload: isUploading });
  const setProgress = (progress) => dispatch({ type: 'SET_PROGRESS', payload: progress });
  const setResults = (results) => dispatch({ type: 'SET_RESULTS', payload: results });
  const addResult = (result) => dispatch({ type: 'ADD_RESULT', payload: result });
  const setAnalyzing = (isAnalyzing) => dispatch({ type: 'SET_ANALYZING', payload: isAnalyzing });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });
  const reset = () => dispatch({ type: 'RESET' });

  const value = {
    ...state,
    setFiles,
    addFiles,
    removeFile,
    clearFiles,
    setUploading,
    setProgress,
    setResults,
    addResult,
    setAnalyzing,
    setError,
    clearError,
    reset,
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};
