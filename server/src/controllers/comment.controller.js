import mongoose,{isValidObjectId} from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if (!videoId || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }


    const pipeline = [
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            username: 1,
                            avatar: 1,
                            coverImage: 1,
                            email: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ];

    const options = {
        page: Math.max(1, parseInt(page, 10) || 1 ),
        limit: Math.max(1, parseInt(limit, 10) || 10 ) 
    }
    
    const comment = await Comment.aggregatePaginate(
        Comment.aggregate(pipeline),
        options
    )

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {content} = req.body;
    const {videoId} = req.params;
    const userId = req.user?._id;

    if(!videoId || !isValidObjectId(videoId)){
        throw new ApiError(400,"video is invalid")
    }
    if(!content){
        throw new ApiError(400,"adding comment not possible")
    }

    const comment = await Comment.create({
        content: content,
        video: videoId,
        owner: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const {content} = req.body;
    const {commentId} = req.params;
    const userId = req.user?._id;

    if(!commentId || !isValidObjectId(commentId)){
        throw new ApiError(400,"comment is invalid")
    }
    if(!content){
        throw new ApiError(400,"updating comment not possible")
    }

    const comment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: userId
        },
        {
            $set: {
                content: content
            }
        },
        {
            returnDocument: "after",
        }
    )

    if(!comment){
        throw new ApiError(400, "comment doesn't exist or it's not added by you")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated successfully"))
})

const deleteComment = asyncHandler(async (req, res) => {
    const {commentId} = req.params;
    const userId = req.user?._id;

    if(!commentId || !isValidObjectId(commentId)){
        throw new ApiError(400,"comment is invalid")
    }

    const comment = await Comment.findOneAndDelete( 
        {
            _id: commentId,
            owner: userId
        }
    )

    if(!comment){
        throw new ApiError(400, "comment doesn't exist or it's not added by you")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
