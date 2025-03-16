

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IAccount } from '@/interfaces/IAccount';
import { IBackend } from '@/interfaces/IBackend';

const dataFilePath = path.resolve(process.cwd(), 'mockData.json');

export async function GET(request: Request, { params }: { params: { id: string } }): Promise<IAccount | NextResponse> {
  try {
    // Check if the file exists
    if (fs.existsSync(dataFilePath)) {
      // Read the file synchronously
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');

      // Assuming you want to return the content as JSON
      const backend: IBackend = JSON.parse(fileData);
      const user = backend?.users?.filter((user: IAccount) => user.id === params.id)?.[0]

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

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {

    if (fs.existsSync(dataFilePath)) {
      // Read the file synchronously
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      // Assuming you want to return the content as JSON
      const backend: IBackend = JSON.parse(fileData);

      const body = await request.json();

      // Validate input
      if (!body.name || !body.email || !body.balance || !body.currency || !body.password) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
      }

      const updatedList = backend.users?.map((user: IAccount) => {
        return user.id === params.id ? { ...user, ...body } : user;
      });

      backend.users = updatedList;

      // Write the updated data to the file
      fs.writeFileSync(dataFilePath, JSON.stringify(backend, null, 2));

      return NextResponse.json({ message: 'User updated successfully', user: body }, { status: 201 });
    } else {
      console.log('File not found');
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {

    if (fs.existsSync(dataFilePath)) {
      // Read the file synchronously
      const fileData = fs.readFileSync(dataFilePath, 'utf-8');
      // Assuming you want to return the content as JSON
      const backend: IBackend = JSON.parse(fileData);

      const updatedList = backend.users?.filter((user: IAccount) => user.id !== params.id);

      backend.users = updatedList;

      // Write the updated data to the file
      fs.writeFileSync(dataFilePath, JSON.stringify(backend, null, 2));

      return NextResponse.json({ message: 'User deleted successfully', ok: true }, { status: 201 });
    } else {
      console.log('File not found');
      return NextResponse.json({ message: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error processing POST request:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
