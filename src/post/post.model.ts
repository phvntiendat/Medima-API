import { Schema, Document } from "mongoose";
import { Group } from "src/group/group.model";
import { User } from "src/user/user.model";

const PostSchema = new Schema(
    {
        title: String,
        content: String,
        image: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },
    },
    {
        timestamps: true,
        collection: 'posts',
        toObject: { virtuals: true }
    }
)

PostSchema.virtual("comments", {
    ref: "Comment",
    foreignField: "post",
    localField: "_id",
    justOne: false
});

PostSchema.virtual("likes", {
    ref: "Like",
    foreignField: "post",
    localField: "_id",
    justOne: false
});


export { PostSchema };
export interface Post extends Document {
    title: string;
    content: string;
    user: User;
    image: String;
    group: Group
}