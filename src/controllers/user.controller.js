import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessAndRefreshTokens = async (userId) => {

    try {
        const user = await User.findById(userId);

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(404, "Error generating")
    }
}
//* POST -> Register a new user
const registerUser = asyncHandler(async (req,res) => {

    const {username,email,password} = req.body;
    console.log(username,email);
    // validate fields 
    if(
        [username,email,password].some((value) => (value?.trim() === ""))
    ) {
        throw new ApiError(401,"All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{username},{email}]
    });

    if(existingUser) {
        throw new ApiError(401,"Email/username alreday register")
    };

    const user = await User.create({
        username,
        email,
        password
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(401,"Something went wrong while registering user")
    }
    
    return res.status(200).json(
        new ApiResponse(200,createdUser, "user register successfully!")
    )
    
})

//* POST -> loged in user using email/username and password
const loginUser = asyncHandler(async (req,res) => {
    const {username,email,password } = req.body;
    if(!username && !email) {
        throw new ApiError(401, "Username or Email is requsired to login");
    }
    if(!password) {
        throw new ApiError(401, "Paasword is required");
    };

    const user = await User.findOne({
        $or: [{username}, {email}]
    });

    if(!user) {
        throw new ApiError(401,"user not found");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if(!isPasswordCorrect) {
        throw new ApiError(401, "Invalid user credentials");
    };
    const {accessToken,refreshToken} = await generateAccessAndRefreshTokens(user._id);
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    }

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, { user: loggedInUser })
        )
});

//* POST -> logout

const logoutUser = asyncHandler(async (req, res) => {
    
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
 
    const options = {
        httpOnly: true,
        secure: true
    }
    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out"))
})
export  { registerUser, loginUser, logoutUser };