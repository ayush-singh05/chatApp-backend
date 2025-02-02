import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// auth middleware to verify user 
export const verifyJWT = asyncHandler(async (req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")

        if(!token) {
            throw new ApiError(401,"Unauthorized request")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
            
        if(!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        req.user = user;

        // console.log(decodedToken);
        next();
       
    } catch (error) {
        throw new ApiResponse(401, error?.message || "Invalid access token");
    }
});

// For WebSocket connections

