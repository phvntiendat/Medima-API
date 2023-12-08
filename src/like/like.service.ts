import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.model';
import { CreateCommentLikeDto, CreateLikeDto } from './like.dto';
import { PostService } from 'src/post/post.service';
import { CommentService } from 'src/comment/comment.service';
import { CommentLikeRepository } from './repositories/commentlike.repository';
import { LikeRepository } from './repositories/like.repository';

@Injectable()
export class LikeService {
    constructor(
        private readonly likeRepository: LikeRepository,
        private readonly commentLikeRepository: CommentLikeRepository,
        private readonly postService: PostService,
        private readonly commentService: CommentService,
    ) { }

    async createLike(user: User, likeDto: CreateLikeDto) {
        likeDto.user = user.id
        // if current user already likes the post, delete the like
        const post = await this.postService.getPostById(user, likeDto.post)
        if(!post) throw new HttpException('No post with this id', HttpStatus.NOT_FOUND);
       
        const like = await this.likeRepository.findByCondition(
            {
                user: user.id,
                post: likeDto.post
            }
        )
        if(like) {
            return await this.likeRepository.deleteByCondition(
                {
                    user: user.id,
                    post: likeDto.post
                }
            )
        }
        return await this.likeRepository.create(likeDto)
    }

    async createCommentLike(user: User, commentlike: CreateCommentLikeDto) {
        commentlike.user = user.id
        // if current user already likes the comment, delete the like
        const comment = await this.commentService.getCommentById(commentlike.comment)
        if(!comment) throw new HttpException('No comment with this id', HttpStatus.NOT_FOUND);

        const like = await this.commentLikeRepository.findByCondition(
            {
                user: user.id,
                comment: commentlike.comment
            }
        )
        if(like) {
            return await this.commentLikeRepository.deleteByCondition(
                {
                    user: user.id,
                    comment: commentlike.comment
                }
            )
        }
        return await this.commentLikeRepository.create(commentlike)
    }

    async getLikesByPostId(id: string, page: number, limit: number = 10) {
        const count = await this.likeRepository.countDocuments({post: id})
        const count_page = Math.ceil(count / limit)
        const likes = await this.likeRepository.getByCondition(
            {
                post: id
            },
            null,
            {
                sort: {
                    _id: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            {
                path: 'user',
                select: 'first_name last_name email avatar'
            }
        )
        return {
            count, count_page, likes
        }
    }

    async getLikesByCommentId(id: string, page: number, limit: number = 10) {
        const count = await this.commentLikeRepository.countDocuments({comment: id})
        const count_page = Math.ceil(count / limit)
        const likes = await this.commentLikeRepository.getByCondition(
            {
                comment: id
            },
            null,
            {
                sort: {
                    _id: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            {
                path: 'user',
                select: 'first_name last_name email avatar'
            }
        )
        return {
            count, count_page, likes
        }
    }
    
}
