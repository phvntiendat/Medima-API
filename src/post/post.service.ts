import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { User } from 'src/user/user.model';
import { PostRepository } from './post.repository';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class PostService {
    constructor(
        private readonly postRepository: PostRepository,
        private readonly groupService: GroupService
    ) { }

    async getAllPosts(page: number, limit: number = 10) {
        const count = await this.postRepository.countDocuments({group: null})
        const countPage = Math.ceil(count / limit)
        const prePosts = await this.postRepository.getByCondition(
            {
                group: null
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
                { path: 'user', select: 'first_name last_name avatar' },
                { path: 'likes' },
                { path: 'comments'}
            ]
        );
        const posts = prePosts.map(post => {
            const postObject = post.toObject();
            const comments = postObject.comments ? postObject.comments.length : 0;
            const likes = postObject.likes ? postObject.likes.length : 0;
            delete postObject.likes
            delete postObject.comments

            return {
                ...postObject,
                likes,
                comments,
            };
        });
        return {
            count, countPage, posts
        }
    }

    async getPostById(user: User, id: string) {
        const post = await this.postRepository.findById(id);
        if (!post) throw new HttpException('No post with this id', HttpStatus.NOT_FOUND);

        if(post.group != null) {
            await this.groupService.privacyCheck(user, post.group._id)
        }

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
        if(postDto.group) {
            const group = await this.groupService.getGroupById(postDto.group)
            if(!group) throw new HttpException('Invalid group id', HttpStatus.BAD_REQUEST);
        }
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
        const prePosts = await this.postRepository.getByCondition(
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
            [
                { path: 'user', select: 'first_name last_name avatar' },
                { path: 'likes' },
                { path: 'comments'}
            ]);
        const posts = prePosts.map(post => {
            const postObject = post.toObject();
            const comments = postObject.comments ? postObject.comments.length : 0;
            const likes = postObject.likes ? postObject.likes.length : 0;
            delete postObject.likes
            delete postObject.comments

            return {
                ...postObject,
                likes,
                comments,
            };
        });
        return {
            count, countPage, posts
        }
    }

    async privacyCheck(user: User, id: string) {
        return await this.groupService.privacyCheck(user, id)
    }
}
