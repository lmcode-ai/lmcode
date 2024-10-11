import { configureStore } from '@reduxjs/toolkit';
import languagesReducer from './languagesSlice'; // import the slice

const store = configureStore({
  reducer: {
    languages: languagesReducer, // add the options reducer
  }
});

export default store;