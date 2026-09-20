import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body;
    let { videoIds } = req.body
    const user = req.user;
    if (!name || !description ) {
        throw new ApiError(400, "name and description are required");
    }

    if(!Array.isArray(videoIds)){
        throw new ApiError(400, "array of videos id is not recieved")
    }


    if ( videoIds.length ){
        for(let vid of videoIds){
           if( !isValidObjectId(vid) ){
                throw new ApiError(400, "not valid object id")
            }
            const video = await Video.findOne({ _id: vid });
            if(!video){
                throw new ApiError(400, "video not found")
            } 
        }
    }

    const newPlaylist = await Playlist.create({
        name,
        description,
        videos: videoIds,
        owner: user?._id
    })

    return res
    .status(201)
    .json(new ApiResponse(201,newPlaylist,"playlist created"))
    //TODO: create playlist

})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "user not found")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            }
        }
    ])

    if( playlist.length == 0 ){
        throw new ApiError(400,"playlists does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"playlists fetched successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
        if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "playlist does not exist")
    }

    const playlist = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },
        {
            $lookup:{
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "videos",
            }
        }
    ])

    if( playlist.length == 0 ){
        throw new ApiError(400,"playlist does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(200,playlist[0],"playlist fetched successfully"))

})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params;
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "invalid playlist or video")
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId },
        {
            $push: {
                videos: videoId
            }
        },
        { returnDocument: "after" }
    )

    if(!playlist){
        throw new ApiError(500, "playlist update failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "playlist updated successfully"))

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "invalid playlist or video")
    }

    const playlist = await Playlist.findOneAndUpdate(
        { _id: playlistId },
        {
            $pull: {
                videos: videoId
            }
        },
        { returnDocument: "after" }
    )

    if(!playlist){
        throw new ApiError(500, "playlist update failed")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "video from playlist deleted successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }

    await Playlist.findByIdAndDelete(
        playlistId
    )

    return res
    .status(200)
    .json(new ApiResponse(200, "playlist deleted successfully"))
    
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "invalid playlist")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {name,description},
        {returnDocument: "after"}
    );

    if(!playlist){
        throw new ApiError(400, "playlist not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "playlist updated successfully"))
    
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
