import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IAccount } from '@/interfaces/IAccount';
import { IBackend } from '@/interfaces/IBackend';
import { ITransaction } from '@/interfaces/ITransaction';

const dataFilePath = path.resolve(process.cwd(), 'mockData.json');

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<IAccount | NextResponse> {
  try {
    // Check if the file exists
    if (fs.existsSync(dataFilePath)) {
      // Read the file synchronously
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');

      // Assuming you want to return the content as JSON
      const backend: IBackend = JSON.parse(fileData);
      const transactions = backend?.transactions?.filter((trans: ITransaction) => trans.senderId === params.id || trans?.recipientId === params.id)

      if (!transactions) {
        return NextResponse.json({ message: 'Transactions not found' }, { status: 404 });
      }

      const mockedTransactions: ITransaction[] = [
        {
          id: "d2d2d2d2d2d2d2d2d2d2d2d2d2d2d2",
          date: "2025-03-16T10:00:00Z",
          description: "Salary deposit",
          type: "receive",
          amount: 1500.00,
          recipientId: "550e8400-e29b-41d4-a716-446655440001",
          recipientName: "John Doe",
          senderId: "550e8400-e29b-41d4-a716-446655440004",
          senderName: "Company XYZ"
        },
        {
          id: "b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3",
          date: "2025-03-16T11:15:00Z",
          description: "Payment for software subscription",
          type: "send",
          amount: 45.99,
          recipientId: "550e8400-e29b-41d4-a716-446655440003",
          recipientName: "Charlie Brown",
          senderId: "550e8400-e29b-41d4-a716-446655440002",
          senderName: "Jane Smith"
        },
        {
          id: "a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4a4",
          date: "2025-03-16T12:45:00Z",
          description: "Transfer to savings account",
          type: "send",
          amount: 200.00,
          recipientId: "550e8400-e29b-41d4-a716-446655440004",
          recipientName: "Lisa Green",
          senderId: "550e8400-e29b-41d4-a716-446655440003",
          senderName: "Charlie Brown"
        },
        {
          id: "e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5",
          date: "2025-03-16T14:00:00Z",
          description: "Payment for rent",
          type: "send",
          amount: 850.00,
          recipientId: "550e8400-e29b-41d4-a716-446655440004",
          recipientName: "Lisa Green",
          senderId: "550e8400-e29b-41d4-a716-446655440002",
          senderName: "John Doe"
        }
      ]

      const res = transactions.concat(mockedTransactions)?.map(t => ({ ...t, date: new Date(t.date).toLocaleDateString() }))

      return NextResponse.json(res, { status: 201 });
    } else {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading file: ', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
