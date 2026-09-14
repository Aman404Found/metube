import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            console.log("file path not found!");
            return null
        }

        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })

        return response; 

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return null
}

export {uploadCloudinary};