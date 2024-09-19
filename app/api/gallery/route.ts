
import connectMongoDB from "@/libs/connectMongodb";
import Gallery from "@/models/gallerymodel";
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';



export async function POST(request: Request) {
    try {
      const data = await request.json();
      console.log('Request data:', data);  // Debugging line
  
      const { image } = data;
      if (!image) {
        throw new Error('Image field is missing');
      }
  
      await connectMongoDB();
  
      const newGallery = await Gallery.create({
        image
      });
  
      return NextResponse.json({ message: "Gallery Created", Gallery: newGallery }, { status: 201 });
    } catch (error: any) {
      console.error("Error creating Gallery:", error);
      return NextResponse.json({ message: "Error Creating Gallery", error: error.message || error }, { status: 500 });
    }
  }
  



