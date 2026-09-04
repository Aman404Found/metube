import mongoose,{ Schema, model } from "mongoose"
import mongoosePaginate from 'mongoose-paginate-v2'

const videoSchema = Schema(
    {
        videoFile: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(model.mongoosePaginate)

export const Video = model("Video",videoSchema);