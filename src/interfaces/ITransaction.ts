export interface ITransaction {
  id: string;
  date: string;
  description: string;
  type: 'send' | 'receive';
  amount: number;
  recipientId: string;
  senderId: string;
}
