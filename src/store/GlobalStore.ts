import { configureStore, PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAccount } from "../interfaces/IAccount";
import { ITransaction } from "@/interfaces/ITransaction";

export const accountInitialState: IAccount = {
  id: undefined,
  name: '',
  password: '',
  email: '',
  profilePicture: undefined,
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

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: [] as ITransaction[],  // Specify the type of the state
  reducers: {
    setTransactions: (state, action: PayloadAction<ITransaction[]>) => {
      return action.payload; // Replace the state with new account data
    },
  },
});

export const { setTransactions } = transactionsSlice.actions;

export const { setAccount, updateBalance, logout } = accountSlice.actions;


export const store = configureStore({
  reducer: {
    account: accountSlice.reducer,
    transactions: transactionsSlice.reducer
  }
});

// Define GlobalState and AppDispatch types
export type GlobalState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
