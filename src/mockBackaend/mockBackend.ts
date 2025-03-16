import { IAccount } from "@/interfaces/IAccount";
import { ITransaction } from "@/interfaces/ITransaction";

interface IBackend {
  users: IAccount[];
  transactions: ITransaction[]
};

export const mockBackend: IBackend = {
  users: [
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      profilePicture: 'https://example.com/images/john.jpg',
      balance: 1500.75,
      currency: 'usd',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'securepassword!789',
      profilePicture: 'https://example.com/images/jane.jpg',
      balance: 2450.50,
      currency: 'eur',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com',
      password: 'charliePass321',
      profilePicture: 'https://example.com/images/charlie.jpg',
      balance: 300.00,
      currency: 'gbp',
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      name: 'Lisa Green',
      email: 'lisa.green@example.com',
      password: 'lisaSecurePass!456',
      profilePicture: 'https://example.com/images/lisa.jpg',
      balance: 5200.00,
      currency: 'gbp',
    },
  ],
  transactions: [
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440101',
      date: '2023-03-15T10:00:05.452Z',
      description: 'Dinner at fancy restaurant',
      type: 'send',
      amount: 753.48,
      recipientId: '550e8400-e29b-41d4-a716-446655440002',
      senderId: '550e8400-e29b-41d4-a716-446655440001',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440102',
      date: '2023-03-15T10:05:10.320Z',
      description: 'Paid back for concert tickets',
      type: 'send',
      amount: 112.74,
      recipientId: '550e8400-e29b-41d4-a716-446655440001',
      senderId: '550e8400-e29b-41d4-a716-446655440003',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440103',
      date: '2023-03-15T11:15:20.621Z',
      description: 'Beer money for the weekend',
      type: 'send',
      amount: 399.99,
      recipientId: '550e8400-e29b-41d4-a716-446655440003',
      senderId: '550e8400-e29b-41d4-a716-446655440002',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440104',
      date: '2023-03-15T12:30:45.849Z',
      description: 'Loan for new laptop',
      type: 'send',
      amount: 1235.67,
      recipientId: '550e8400-e29b-41d4-a716-446655440002',
      senderId: '550e8400-e29b-41d4-a716-446655440004',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440105',
      date: '2023-03-15T14:45:55.678Z',
      description: 'Paid for Uber ride',
      type: 'send',
      amount: 75.50,
      recipientId: '550e8400-e29b-41d4-a716-446655440004',
      senderId: '550e8400-e29b-41d4-a716-446655440003',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440106',
      date: '2023-03-15T15:20:30.901Z',
      description: 'Netflix subscription split',
      type: 'send',
      amount: 108.50,
      recipientId: '550e8400-e29b-41d4-a716-446655440003',
      senderId: '550e8400-e29b-41d4-a716-446655440001',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440107',
      date: '2023-03-15T16:40:15.321Z',
      description: 'Gift for birthday',
      type: 'send',
      amount: 980.22,
      recipientId: '550e8400-e29b-41d4-a716-446655440001',
      senderId: '550e8400-e29b-41d4-a716-446655440002',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440108',
      date: '2023-03-15T17:55:05.654Z',
      description: 'Rent payment',
      type: 'send',
      amount: 640.78,
      recipientId: '550e8400-e29b-41d4-a716-446655440003',
      senderId: '550e8400-e29b-41d4-a716-446655440004',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440109',
      date: '2023-03-15T18:10:45.876Z',
      description: 'Shared grocery bill',
      type: 'send',
      amount: 300.30,
      recipientId: '550e8400-e29b-41d4-a716-446655440004',
      senderId: '550e8400-e29b-41d4-a716-446655440001',
    },
    {
      id: 'd0e3e840-e29b-41d4-a716-446655440110',
      date: '2023-03-15T19:30:30.432Z',
      description: 'Hotel booking for vacation',
      type: 'send',
      amount: 876.45,
      recipientId: '550e8400-e29b-41d4-a716-446655440001',
      senderId: '550e8400-e29b-41d4-a716-446655440002',
    },
  ],
};

export const getMockUserById = async (storage: string | null, id: string): Promise<IAccount> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const users: IAccount[] = await getMockUsers(storage);
  return users.filter((user) => user.id === id)?.[0];
}

export const getMockUsers = async (storage: string | null): Promise<IAccount[]> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const backend = await JSON.parse(storage) as IBackend;
  return backend.users;
}

export const getMockTransactions = async (storage: string | null): Promise<ITransaction[]> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const backend = await JSON.parse(storage) as IBackend;
  return backend.transactions;
}

export const getMockTransactionsBySenderId = async (storage: string | null, id: string): Promise<ITransaction[]> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const backend = await JSON.parse(storage) as IBackend;
  return backend.transactions?.filter((transaction) => transaction.senderId === id);
}

export const getMockTransactionsByRecipientId = async (storage: string | null, id: string): Promise<ITransaction[]> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const backend = await JSON.parse(storage) as IBackend;
  return backend.transactions?.filter((transaction) => transaction.recipientId === id);
}

export const login = async (storage: string | null, email: string, password: string): Promise<IAccount> => {
  if (storage === null) {
    throw new Error('Storage is not available');
  }
  const users: IAccount[] = await getMockUsers(storage);
  const user = users.filter((user) => user.email === email && user.password === password)?.[0];
  if (!user) {
    throw new Error('User not found');
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user);
    }, 1000);
  });
}
