import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  options: [
    'Python',
    'Java',
    'C',
    'C++',
    'Javascript',
    'Typescript'
  ]
};

const languageOptionsSlice = createSlice({
  name: 'languageOptions',
  initialState,
  reducers: {
    addLanguage: (state, action) => {
      state.options.push(action.payload);
    }
  }
});

export const { addLanguage } = languageOptionsSlice.actions;
export const selectLanguageOptions = (state) => state.languageOptions.options;
export default languageOptionsSlice.reducer;
