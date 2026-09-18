import mongoose from "mongoose";

const playlistSchema = mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    videos: [{
        type: mongoose.Types.ObjectId,
        ref: "Video"
    }],
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestams: true});

export const Playlist = mongoose.model("Playlist", playlistSchema);