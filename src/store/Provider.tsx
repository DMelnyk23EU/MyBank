"use client"; // Ensure this is a Client Component

import { store } from "./GlobalStore";
import { Provider } from "react-redux";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
