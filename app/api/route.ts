
import connectMongoDB from "@/libs/connectMongodb";
import Member from "@/models/memberModel";
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    const data= await request.json();  

    const { name, branch, rollNumber,image,batch, position } = data;
    await connectMongoDB();

    const newMember = await Member.create({
      name,
      branch,
      rollNumber,
      image,
      batch,
      position,
    });

    return NextResponse.json({ message: "Member Created", member: newMember }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating member:", error);
    return NextResponse.json({ message: "Error Creating Member", error: error.message || error }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { rollNumber } = await request.json(); 

    await connectMongoDB();

    const result = await Member.deleteOne({ rollNumber });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "Member Deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Member Not Found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error deleting member:", error);
    return NextResponse.json({ message: "Error Deleting Member", error: error.message || error }, { status: 500 });
  }
}

