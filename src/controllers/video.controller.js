import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    
    
})

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400, "title and description are mandatory")
    }

    const { videoFile, thumbnail } = req.files;

    if(!videoFile || !thumbnail){
        throw new ApiError(400," video or thumbnail not recieved ");
    }

    const videoFilePath = videoFile?.[0]?.path;
    const thumbnailPath = thumbnail?.[0]?.path;

    const videoInstance = await uploadCloudinary(videoFilePath) // what will it print if i log it, and why are we passing only one value when we have already specified video and thumbnail?
    const thumbnailInstance = await uploadCloudinary(thumbnailPath);

    if(!videoInstance || !thumbnailInstance){
        throw new ApiError(500, "video and thumbnail upload failed")
    }

    const publishedVideo = await Video.create({
        videoFile: videoInstance.url,
        thumbnail: thumbnailInstance.url,
        title,
        description,
        duration: videoInstance.duration,
        isPublished: true,
        views: 0,
        owner: req.user._id
    })

    return res
    .status(200)
    .json(new ApiResponse(200, publishedVideo, "video uploaded successfully"))
    
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "this not a valid video")
    }

    const video = await Video.findById(videoId);

    if(!video){
        throw new ApiError(404, "video not found")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, video, "video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "this not a valid video")
    }

    const video = await Video.findOne({
        owner: req.user._id,
        _id: videoId
    })

    if(!video){
        throw new ApiError(403, "video updation forbidden")
    }// how can i use this to directly update all the below 
    
    const { title, description } = req.body; 
    const thumbnailLocalPath = req.file?.path;

    if(!title?.trim() && !description?.trim() && !thumbnailLocalPath){
        throw new ApiError(400, "atleast one of title , description and thumnail is required to update video details")
    }

    let thumbnail;
    if (thumbnailLocalPath) {
    thumbnail = await uploadCloudinary(thumbnailLocalPath);

    if (!thumbnail.url) {
        throw new ApiError(500, "Error while uploading thumbnail");
    }}

    if(title){
        video.title = title;
    }

    if(description){
        video.description = description;
    }

    if(thumbnail){
        video.thumbnail = thumbnail.url;
    }

    const updatedVideo = await video.save({validateBeforeSave: false})

    if(!updatedVideo){
        throw new ApiError(400, "video updation failed")
    }
    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideo, "video updated successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "this not a valid video")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user?._id,
    })

    if(!video){
        throw new ApiError(403, "you can't delete other's video")
    }

    await video.deleteOne();// am i required to save it?

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "video deleted successfully"))

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "this not a valid video")
    }

    const video = await Video.findOne({
        _id: videoId,
        owner: req.user?._id,
    })

    if(!video){
        throw new ApiError(403, "video not found or you don't have permission to modify it")
    } 

    const publishStatus = video.isPublished;

    video.isPublished = !publishStatus;

    await video.save({validateBeforeSave: false});// is it possible to use video.updateOne()... is there something exists like this?

    
    return res
    .status(200)
    .json(new ApiResponse(200, {isPublished: video.isPublished}, "video state toggle successfully"))

})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
