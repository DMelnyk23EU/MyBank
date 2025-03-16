import { Currency } from "../customTypes/Currency";

export interface IAccount {
  id: string | undefined;
  name: string;
  password: string;
  email: string;
  profilePicture: string | undefined;
  balance: number;
  currency: Currency;
}
