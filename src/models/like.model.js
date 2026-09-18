import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    comment: {
        type: mongoose.Types.ObjectId,
        ref: "Comment"
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "Video"
    },
    likeBy: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},
{timestamps: true});
//tweet
export const Like = mongoose.model("Like", likeSchema);