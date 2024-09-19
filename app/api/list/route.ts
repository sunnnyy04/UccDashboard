import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Member from '@/models/memberModel';

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
  
    try {
      await mongoose.connect(process.env.MONGODB_URI || '');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Error connecting to database:', error);
      throw new Error('Database connection error');
    }
  };
  

export async function GET() {
  await connectDB();

  try {
    const members = await Member.find({});
    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json({ message: 'Error fetching members', error }, { status: 500 });
  }
}

