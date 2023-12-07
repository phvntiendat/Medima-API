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
        // check if postId exist
        const post = await this.postService.getPostById(user, commentDto.post)
        if (!post) throw new HttpException('Invalid Post Id', HttpStatus.BAD_REQUEST);

        // add commenter
        commentDto.user = user.id

        const comment = await this.commentRepository.create(commentDto)
        return comment.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

    async createReply(user: User, replyDto: CreateReplyDto) {
        
        const parent = await this.commentRepository.findById(replyDto.parent)
        if(!parent) throw new HttpException('Invalid Parent Comment Id', HttpStatus.BAD_REQUEST);
        replyDto.user = user.id
        replyDto.post = parent.post._id
        
        const post = await this.postService.getPostById(user, replyDto.post)
        const reply = await this.commentRepository.create(replyDto)
        return reply.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

    async getCommentByPostId(user: User, id: string, page:number, limit:number = 6) {
        const post = await this.postService.getPostById(user, id)
        var mongoose = require('mongoose');
        const count = await this.commentRepository.countDocuments({post: new mongoose.Types.ObjectId(id), parent: null})
        const countPage = Math.ceil(count / limit)
        const oldComments = await this.commentRepository.getByCondition(
            {
                post: new mongoose.Types.ObjectId(id),
                parent: null
            },
            null,
            {
                sort: {
                    _id: -1,
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
        const comments = oldComments.map(comment => {
            const commentObject = comment.toObject();
            const replies = commentObject.replies ? commentObject.replies.length : 0;
            const likes = commentObject.likes ? commentObject.likes.length : 0;
            delete commentObject.likes
            delete commentObject.replies

            return {
                ...commentObject,
                likes,
                replies,
            };
        });
        
        return {
            count,
            countPage,
            comments
        }
    }

    async getReplies(user: User, id: string, page:number, limit:number = 6) {
        const parent = await this.commentRepository.findById(id)
        const post = await this.postService.getPostById(user, parent.post._id)
        var mongoose = require('mongoose');
        const count = await this.commentRepository.countDocuments({parent: new mongoose.Types.ObjectId(id)})
        const countPage = Math.ceil(count / limit)

        const preReplies = await this.commentRepository.getByCondition(
            {
                parent: new mongoose.Types.ObjectId(id)
            },
            null,
            {
                sort: {
                    _id: -1,
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
        const replies = preReplies.map(reply => {
            const replyObject = reply.toObject();
            const replies = replyObject.replies ? replyObject.replies.length : 0;
            const likes = replyObject.likes ? replyObject.likes.length : 0;
            delete replyObject.likes
            delete replyObject.replies

            return {
                ...replyObject,
                likes,
                replies,
            };
        });
        
        return {
            count,
            countPage,
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
        
    }

    async getCommentById(id: string) {
        return await this.commentRepository.findById(id)
    }
}
