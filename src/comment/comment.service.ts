import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto, CreateReplyDto, UpdateCommentDto } from './comment.dto';
import { User } from 'src/user/user.model';
import { CommentRepository } from './comment.repository';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
        private readonly postService: PostService,
    ) { }

    async createComment(user: User, commentDto: CreateCommentDto) {
        // check if post exist
        const post = await this.postService.getPostById(user, commentDto.post)
        if (!post) throw new HttpException('Invalid Post Id', HttpStatus.BAD_REQUEST);

        // assign creator
        commentDto.user = user.id

        const comment = await this.commentRepository.create(commentDto)
        return comment.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

    async createReply(user: User, replyDto: CreateReplyDto) {
        
        const parent = await this.commentRepository.findById(replyDto.parent)
        if(!parent) throw new HttpException('Invalid Parent Comment Id', HttpStatus.BAD_REQUEST);
        replyDto.user = user.id
        replyDto.post = parent.post._id
        
        // group access check
        await this.postService.getPostById(user, replyDto.post)

        const reply = await this.commentRepository.create(replyDto)
        return reply.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

    async getCommentByPostId(user: User, id: string, page:number, limit:number = 10) {
        // group access check
        await this.postService.getPostById(user, id)

        var mongoose = require('mongoose');
        const count = await this.commentRepository.countDocuments({post: new mongoose.Types.ObjectId(id), parent: null})
        const count_page = Math.ceil(count / limit)
        const temp_comments = await this.commentRepository.getByCondition(
            {
                post: new mongoose.Types.ObjectId(id),
                parent: null
            },
            null,
            {
                sort: {
                    createdAt: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            [
                { path: 'replies'},
                { path: 'likes'},
                { path: 'user', select: 'first_name last_name email avatar'}
            ]
        )
        const comments = temp_comments.map(comment => {
            const obj_comment = comment.toObject();
            // replies and likes count
            const replies = obj_comment.replies ? obj_comment.replies.length : 0;
            const likes = obj_comment.likes ? obj_comment.likes.length : 0;
            delete obj_comment.likes
            delete obj_comment.replies

            return {
                ...obj_comment,
                likes,
                replies,
            };
        });
        
        return {
            count,
            count_page,
            comments
        }
    }

    async getReplies(user: User, id: string, page:number, limit:number = 6) {
        const parent = await this.commentRepository.findById(id)

        // access check
        await this.postService.getPostById(user, parent.post._id)
        var mongoose = require('mongoose');
        const count = await this.commentRepository.countDocuments({parent: new mongoose.Types.ObjectId(id)})
        const count_page = Math.ceil(count / limit)

        const temp_replies = await this.commentRepository.getByCondition(
            {
                parent: new mongoose.Types.ObjectId(id)
            },
            null,
            {
                sort: {
                    createdAt: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            [
                { path: 'replies'},
                { path: 'likes'},
                { path: 'user', select: 'first_name last_name email avatar'}
            ]
        )
        const replies = temp_replies.map(reply => {
            const obj_reply = reply.toObject();
            // count likes and replies
            const replies = obj_reply.replies ? obj_reply.replies.length : 0;
            const likes = obj_reply.likes ? obj_reply.likes.length : 0;
            delete obj_reply.likes
            delete obj_reply.replies

            return {
                ...obj_reply,
                likes,
                replies,
            };
        });
        
        return {
            count,
            count_page,
            replies
        }
    }

    async updateComment(user: User, id: string, commentDto: UpdateCommentDto) {
        const comment = await this.commentRepository.findById(id)
        if (!comment) throw new HttpException('No comment with this id', HttpStatus.NOT_FOUND);
        if (!comment.user.equals(user._id)) throw new HttpException('Only creator has permission', HttpStatus.BAD_REQUEST);
        const updatedComment = (await this.commentRepository.findByIdAndUpdate(id, commentDto))
        .populate({ path: 'user', select: 'first_name last_name avatar email' })
        return (await updatedComment).toObject()
    }

    async deleteComment(user: User, id: string) {
        const comment = await this.commentRepository.findById(id)
        if (!comment) throw new HttpException('No comment with this id', HttpStatus.NOT_FOUND);
        if (!comment.user.equals(user._id)) throw new HttpException('Only creator has permission', HttpStatus.BAD_REQUEST);
        return await this.commentRepository.deleteOne(id)
    }   

    async getCommentById(id: string) {
        return await this.commentRepository.findById(id)
    }
}
