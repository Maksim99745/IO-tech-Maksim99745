import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  query: string;
  isSearchOpen: boolean;
}

const initialState: SearchState = {
  query: "",
  isSearchOpen: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearchQuery: (state) => {
      state.query = "";
    },
    setSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.isSearchOpen = action.payload;
    },
  },
});

export const { setSearchQuery, clearSearchQuery, setSearchOpen } =
  searchSlice.actions;
export default searchSlice.reducer;
