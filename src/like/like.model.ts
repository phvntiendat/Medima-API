import { Schema, Document } from "mongoose";
import { User } from "src/user/user.model";
import { Post } from "src/post/post.model";
import { Comment } from "src/comment/comment.model";

const LikeSchema = new Schema(
    {
        post: { type: Schema.Types.ObjectId, ref: 'Post'},
        user: { type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true,
        collection: 'likes',
        toObject: { virtuals: true }
    }
)

export { LikeSchema };
export interface Like extends Document {
    post: Post;
    user: User;
}

const CommentLikeSchema = new Schema(
    {
        comment: { type: Schema.Types.ObjectId, ref: 'Comment'},
        user: { type: Schema.Types.ObjectId, ref: 'User'},
    },
    {
        timestamps: true,
        collection: 'commentlikes',
        toObject: { virtuals: true }
    }
)

export { CommentLikeSchema };
export interface CommentLike extends Document {
    comment: Comment;
    user: User;
}