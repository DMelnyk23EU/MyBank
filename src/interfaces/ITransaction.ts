import { TransactionType } from "@/customTypes/TransactionType";

export interface ITransaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  amount: number;
  recipientId: string;
  recipientName: string;
  senderName: string;
  senderId: string;
}
