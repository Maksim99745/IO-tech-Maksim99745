import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Language } from "@/types";

interface LanguageState {
  currentLanguage: Language;
}

const getInitialLanguage = (): Language => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("i18nextLng") as Language;
    return stored || "en";
  }
  return "en";
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
