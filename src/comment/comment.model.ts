import { Schema, Document } from "mongoose";
import { Post } from "src/post/post.model";
import { User } from "src/user/user.model";

const CommentSchema = new Schema(
    {
        content: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment' }
    },
    {
        timestamps: true,
        collection: 'comments',
        toObject: { virtuals: true }
    }
)

CommentSchema.virtual("replies", {
    ref: "Comment",
    foreignField: "parent",
    localField: "_id",
    justOne: false
});

CommentSchema.virtual("likes", {
    ref: "CommentLike",
    foreignField: "comment",
    localField: "_id",
    justOne: false
});

export { CommentSchema };
export interface Comment extends Document {
    content: string;
    user: User;
    post: Post;
    parent: Comment
}