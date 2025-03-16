import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IAccount } from '@/interfaces/IAccount';
import { IBackend } from '@/interfaces/IBackend';

const dataFilePath = path.resolve(process.cwd(), 'mockData.json');

export async function POST(request: Request): Promise<IAccount | NextResponse> {
  try {
    // Check if the file exists
    if (fs.existsSync(dataFilePath)) {
      // Read the file synchronously
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');

      const body = await request.json();

      // Assuming you want to return the content as JSON
      const backend: IBackend = JSON.parse(fileData);
      const user = backend?.users?.filter((user: IAccount) => (user.email === body?.email && user.password === body?.password))?.[0]

      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      return NextResponse.json(user, { status: 201 });
    } else {
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error reading file: ', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
