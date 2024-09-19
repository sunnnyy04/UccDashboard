
import connectMongoDB from "@/libs/connectMongodb";
import File from "@/models/filesmodel";
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: Request) {
  try {
    const data= await request.json();  

    const { title,description,file } = data;
    await connectMongoDB();

    const newFile = await File.create({
        title,
        description,
        file
    });

    return NextResponse.json({ message: "File Created", File: newFile }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating File:", error);
    return NextResponse.json({ message: "Error Creating File", error: error.message || error }, { status: 500 });
  }
}


export async function DELETE(request: Request) {
  try {
    const { rollNumber } = await request.json(); 

    await connectMongoDB();

    const result = await File.deleteOne({ rollNumber });

    if (result.deletedCount > 0) {
      return NextResponse.json({ message: "File Deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "File Not Found" }, { status: 404 });
    }
  } catch (error: any) {
    console.error("Error deleting File:", error);
    return NextResponse.json({ message: "Error Deleting File", error: error.message || error }, { status: 500 });
  }
}

