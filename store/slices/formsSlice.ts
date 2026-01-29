import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormsState {
  subscription: {
    isLoading: boolean;
    error: string | null;
    success: boolean;
  };
}

const initialState: FormsState = {
  subscription: {
    isLoading: false,
    error: null,
    success: false,
  },
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.subscription.isLoading = action.payload;
    },
    setSubscriptionError: (state, action: PayloadAction<string | null>) => {
      state.subscription.error = action.payload;
      state.subscription.success = false;
    },
    setSubscriptionSuccess: (state, action: PayloadAction<boolean>) => {
      state.subscription.success = action.payload;
      state.subscription.error = null;
    },
    resetSubscription: (state) => {
      state.subscription = initialState.subscription;
    },
  },
});

export const {
  setSubscriptionLoading,
  setSubscriptionError,
  setSubscriptionSuccess,
  resetSubscription,
} = formsSlice.actions;
export default formsSlice.reducer;
