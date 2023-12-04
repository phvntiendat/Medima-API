import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { User } from 'src/user/user.model';
import { PostRepository } from './post.repository';

@Injectable()
export class PostService {
    constructor(private readonly postRepository: PostRepository) { }

    async getAllPosts(page: number, limit: number = 10) {
        const count = await this.postRepository.countDocuments({})
        const countPage = Math.ceil(count / limit)
        const posts = await this.postRepository.getByCondition(
            {},
            null,
            {
                sort: {
                    createdAt: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            { path: 'user', select: 'first_name last_name avatar' });
        return {
            count, countPage, posts
        }
    }

    async getPostById(id: string) {
        const post = await this.postRepository.findById(id);
        if (!post) throw new HttpException('No post with this id', HttpStatus.NOT_FOUND);
        const returnPost = await post.populate(
            [
                { path: 'user', select: 'first_name last_name avatar' },
                { path: 'likes' },
                { path: 'comments'}
            ]
        )
        const postObj = returnPost.toObject()
        const likes = postObj.likes.length
        const comments = postObj.comments.length

        delete postObj.likes
        delete postObj.comments
        return {
            ...postObj,
            likes,
            comments
        }
    }

    async createPost(user: User, postDto: CreatePostDto) {
        postDto.user = user.id;
        const newPost = await this.postRepository.create(postDto)
        return newPost.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

    async deletePost(user: User, id: string) {
        const post = await this.postRepository.findById(id)
        if (!post) throw new HttpException('No post with this id', HttpStatus.NOT_FOUND);
        if (!post.user.equals(user._id)) throw new HttpException('Only creator has permission', HttpStatus.BAD_REQUEST);
        return await this.postRepository.deleteOne(id);
    }

    async updatePost(user: User, id: string, postDto: UpdatePostDto) {
        const post = await this.postRepository.findById(id)
        if (!post) throw new HttpException('No post with this id', HttpStatus.NOT_FOUND);
        if (!post.user.equals(user._id)) throw new HttpException('Only creator has permission', HttpStatus.BAD_REQUEST);
        const updatedPost = (await this.postRepository.findByIdAndUpdate(id, postDto)).populate(
            [
                { path: 'user', select: 'first_name last_name avatar' },
                {
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'first_name last_name avatar'
                    },
                    options: {
                        sort: {
                            createdAt: -1
                        }
                    }

                }
            ]
        )
        return (await updatedPost).toObject()
    }

    async getAllPostsByUserId(id: string, page: number, limit: number = 10) {
        const count = await this.postRepository.countDocuments({ user: id })
        const countPage = Math.ceil(count / limit)
        const posts = await this.postRepository.getByCondition(
            {
                user: id
            },
            null,
            {
                sort: {
                    _id: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            { path: 'user', select: 'first_name last_name avatar' });
        return {
            count,
            countPage,
            posts
        }
    }
}
