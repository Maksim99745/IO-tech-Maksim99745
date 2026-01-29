import { configureStore } from "@reduxjs/toolkit";
import languageReducer from "./slices/languageSlice";
import searchReducer from "./slices/searchSlice";
import formsReducer from "./slices/formsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      language: languageReducer,
      search: searchReducer,
      forms: formsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
