import { configureStore, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAccount } from "../interfaces/IAccount";


export const accountInitialState: IAccount = {
  id: 'undefined',
  name: 'Dmytro Maksymov',
  password: '12131223',
  email: 'dawdawd@dawda.daw',
  profilePicture: '/addImage.svg',
  balance: 0,
  currency: 'usd'
};

const accountSlice = createSlice({
  name: 'account',
  initialState: accountInitialState,
  reducers: {
    setAccount: (state, action: PayloadAction<IAccount>) => {
      return action.payload; // Replace the state with new account data
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      if (state) {
        state.balance += action.payload; // Update balance
      }
    },
    logout: () => accountInitialState // Clear the state when the user logs out
  }
});

export const { setAccount, updateBalance, logout } = accountSlice.actions;


export const store = configureStore({
  reducer: {
    account: accountSlice.reducer
  }
});

// Define GlobalState and AppDispatch types
export type GlobalState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
