import { configureStore } from '@reduxjs/toolkit';
import languageOptionsReducer from './languageOptionsSlice'; // import the slice

const store = configureStore({
  reducer: {
    languageOptions: languageOptionsReducer, // add the options reducer
  }
});

export default store;