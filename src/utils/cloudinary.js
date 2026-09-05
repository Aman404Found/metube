import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadCloudinary = async (filePath) => {
    try {
        if (!filePath) {
            console.log("file path not found!");
            return null
        }
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        console.log("file uploaded",response.url);
        return response;

    } catch (error) {
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    return null
}

export {uploadCloudinary};