import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

// Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Interface for Cloudinary upload result
interface CloudinaryUploadResult {
    public_id: string;
    secure_url: string; // Include this if your Cloudinary configuration supports it
    [key: string]: any;
}

export async function POST(request: NextRequest) {
    try {
        // Retrieve the file from the form data
        const formData = await request.formData();
        const file = formData.get("file"); // Assuming the file field name is "file"

        if (!file) {
            return NextResponse.json({ error: "File not found" }, { status: 400 });
        }

        // Convert the file to a buffer
        const bytes = await (file as Blob).arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result: CloudinaryUploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                { folder: "UCCmember" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            );
            uploadStream.end(buffer);
        });

        // Return the secure_url in the response
        return NextResponse.json(
            {
                url: result.secure_url // Return the URL of the uploaded image
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Upload image failed:", error);
        return NextResponse.json({
            error: "Upload image failed"
        }, {
            status: 500
        });
    }
}
