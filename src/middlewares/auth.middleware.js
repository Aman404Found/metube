import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    const token = req.cookies?.accessToken || req.header("Authorisation")?.replace("Bearer ","");
    
    if(!token){
        throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
        );
    } catch {
        throw new ApiError(401, "Invalid or expired access token");
    }

    const user = await User.findById(decodedToken._id).select("-password -accessToken");

    if(!user) {
        throw new ApiError(401, "Invalid Access Token")
    }

    req.user = user;

    next();
})