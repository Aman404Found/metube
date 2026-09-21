import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "invalid video")
    }

    const video = await Video.findById(videoId);// but will not it add other query to our db and increase expense?

    if (!video) {
        throw new ApiError(404, "Video not found");
    }
    
    const like = await Like.findOne({
        video: videoId,
        likedBy: req.user?._id
    });

    if (like) {
        await like.deleteOne();

        return res
        .status(200)
        .json(new ApiResponse(200, { isVideoLiked: false }, "Video unliked successfully"));
    } else {
        await Like.create({
            video: videoId,
            likedBy: req.user?._id
        });

        return res
        .status(200)
        .json(new ApiResponse(200, { isVideoLiked: true }, "Video liked successfully"));
    }

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "invalid comment")
    }
    
    
    const commentLiked = await Like.findOne({
        comment: commentId,
        likedBy: req.user?._id
    });

    if (commentLiked) {
        await commentLiked.deleteOne();

        return res
        .status(200)
        .json(new ApiResponse(200, { isCommentLiked: false }, "comment unliked successfully"));
    } else {
        await Like.create({
            comment: commentId,
            likedBy: req.user?._id
        });

        return res
        .status(200)
        .json(new ApiResponse(200, { isCommentLiked: true }, "comment liked successfully"));
    }
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "invalid tweet")
    }
    
    const tweetLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if (tweetLiked) {
        await tweetLiked.deleteOne();

        return res
        .status(200)
        .json(new ApiResponse(200, { isTweetLiked: false }, "tweet unliked successfully"));
    } else {
        await Like.create({
            tweet: tweetId,
            likedBy: req.user?._id
        });

        return res
        .status(200)
        .json(new ApiResponse(200, { isTweetLiked: true }, "tweet liked successfully"));
    }
}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id;

    const likedVideo = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(userId),
                video: {
                    $exists: true,
                    $ne: null
                }
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video"
            }
        },
        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },
        {
            $project: {
                video: 1,
                likedBy: 1
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideo, "liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}