import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IBackend } from '@/interfaces/IBackend';

const dataFilePath = path.resolve(process.cwd(), 'mockData.json');

export async function POST(request: Request) {
  try {
    console.log('🔹 Incoming POST request');

    if (!fs.existsSync(dataFilePath)) {
      console.error('🚨 File not found:', dataFilePath);
      return NextResponse.json({ message: 'File not found' }, { status: 500 });
    }

    // Read existing data
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const backend: IBackend = JSON.parse(fileData);

    const body = await request.json();
    console.log('📌 Received data:', body); // Log received body

    backend.transactions.push(body);
    fs.writeFileSync(dataFilePath, JSON.stringify(backend, null, 2));

    return NextResponse.json({ message: 'User registered successfully', transaction: body }, { status: 201 });

  } catch (error) {
    console.error('🔥 Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
