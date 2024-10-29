import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  options: [
    'Python',
    'Java',
    'C',
    'C++',
    'Javascript',
    'Typescript',
    'Verilog',
    'Scala'
  ]
};

const languagesSlice = createSlice({
  name: 'languages',
  initialState,
  reducers: {
    addLanguage: (state, action) => {
      state.options.push(action.payload);
    }
  }
});

export const { addLanguage } = languagesSlice.actions;
export const selectLanguageOptions = (state) => state.languages.options;
export default languagesSlice.reducer;
