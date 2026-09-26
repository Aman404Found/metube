import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;
    const userId = req.user?._id;

    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }


    const tweet = await Tweet.create({
        content: content,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(500, "tweet creation failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet creation successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params;
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "invalid user id")
    }

    const tweets = await Tweet.find(
        {
            owner: userId
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweets fetched successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content } = req.body;
    const userId = req.user?._id;
    const {tweetId} = req.params; // i forgot what will req.params print
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet")
    }
    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    const tweet = await Tweet.findOneAndUpdate(
        { 
            _id : tweetId,
            owner: userId
        },
        {
            $set: {
                content: content
            }
        },
        {
            returnDocument: "after" // i just forgot where can i use this attribute
        }
    )

    if(!tweet){
        throw new ApiError(500, "tweet updation failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet updated successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const userId = req.user?._id;
    const {tweetId} = req.params; // i forgot what will req.params print
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet")
    }

    const tweet = await Tweet.findOneAndDelete(
        { 
            _id: tweetId,
            owner: userId
        }
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet not found or unauthorized to delete");
    }


    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "tweet deleted successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
