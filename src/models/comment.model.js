import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
    content:{
        type: String,
        trim: true
    },
    video: {
        type: mongoose.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
},{timestams: true});

commentSchema.plugin(model.mongoosePaginate)

export const Comment = mongoose.model("Comment", commentSchema);