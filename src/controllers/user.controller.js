import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js"

const registerUser = asyncHandler(async (req, res) => {
    //get user details from frontend,
    //validation - if some required details are empty
    //check if user already exists
    //check for image and avatar
    //upload avatar and cover to multer and then cloudinary
    //create user object - create entry in db
    //create user object - create user entry in db
    //remove password and refresh token field from response
    //check if response recieved,if not then check if user entry is done or not
    //return response
    
    //form ya json se data aayega to req.body me mil jaeega, but iske alawa ek aur method hai using url
    const {email, username, password } = req.body;
    console.log(req.body)

    if(
        [fullName, email, username, password].some((field) => field?.trim() === "" )){
            throw new ApiError(400, "All fields are required!");
        }

        const existedUser = User.findOne({
            $or: [{username}, {email}]
        })
    
        if(existedUser){
            throw new ApiError(409,"User with email or username already exists")
        }
})

export {registerUser};