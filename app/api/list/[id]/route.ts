import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Member from '@/models/memberModel';
import { NextApiRequest, NextApiResponse } from 'next';

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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const id = params.id;

  try {
    const member = await Member.findById(id);
    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const id = params.id;
  const updatedData = await request.json();

  try {
    const member = await Member.findByIdAndUpdate(id, updatedData, { new: true });
    if (!member) {
      return NextResponse.json({ message: 'Member not found' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const id = params.id;

  try {
    const result = await Member.deleteOne({ _id: id });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "Member Deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Member Not Found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ message: "Error Deleting Member", error: error}, { status: 500 });
  }
}