import { Schema, Document } from "mongoose";
import { Post } from "src/post/post.model";
import { User } from "src/user/user.model";

const CommentSchema = new Schema(
    {
        content: String,
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        post: { type: Schema.Types.ObjectId, ref: 'Post' },
    },
    {
        timestamps: true,
        collection: 'comments',
        toObject: { virtuals: true }
    }
)


export { CommentSchema };
export interface Comment extends Document {
    content: string;
    user: User;
    post: Post;
}