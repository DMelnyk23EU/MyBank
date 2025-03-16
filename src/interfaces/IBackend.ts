import { IAccount } from "./IAccount";
import { ITransaction } from "./ITransaction";

export interface IBackend {
  users: IAccount[];
  transactions: ITransaction[]
};
