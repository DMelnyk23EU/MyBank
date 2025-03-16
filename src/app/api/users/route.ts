import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { IAccount } from '@/interfaces/IAccount';
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

    // 🔴 Check for missing required fields
    if (!body.name || !body.email || body.balance === undefined || !body.currency || !body.password) {
      console.error('❌ Missing required fields:', body);
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 🔴 Check if user already exists
    const existingUser = backend.users.find((user: IAccount) => user.email === body.email);
    if (existingUser) {
      console.error('❌ User already exists:', body.email);
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    // ✅ Create new user
    const newUser: IAccount = {
      id: body?.id, // Generate unique ID
      name: body.name,
      email: body.email,
      password: body.password,
      profilePicture: body.profilePicture ?? '/defaultProfile.png',
      balance: body.balance,
      currency: body.currency,
    };

    backend.users.push(newUser);
    fs.writeFileSync(dataFilePath, JSON.stringify(backend, null, 2));

    console.log('✅ User registered:', newUser);
    return NextResponse.json({ message: 'User registered successfully', user: newUser }, { status: 201 });

  } catch (error) {
    console.error('🔥 Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const name = url.searchParams.get('name'); // Get the name from query parameter

    if (!fs.existsSync(dataFilePath)) {
      console.error('🚨 File not found:', dataFilePath);
      return NextResponse.json({ message: 'File not found' }, { status: 500 });
    }

    // Read existing data
    const fileData = fs.readFileSync(dataFilePath, 'utf-8');
    const backend: IBackend = JSON.parse(fileData);

    if (!name) {
      return NextResponse.json({ message: 'Name parameter is required' }, { status: 400 });
    }

    // Find users matching the name
    const user = backend.users.find((user: IAccount) => user.name.toLowerCase().includes(name.toLowerCase()));

    if (user) {
      return NextResponse.json(user);
    } else {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('🔥 Server Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
