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
        const temp_posts = await this.postRepository.getByCondition(
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

        // count likes and comments
        const posts = temp_posts.map(post => {
            const obj_post = post.toObject();
            const comments = obj_post.comments ? obj_post.comments.length : 0;
            const likes = obj_post.likes ? obj_post.likes.length : 0;
            delete obj_post.likes
            delete obj_post.comments

            return {
                ...obj_post,
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

        // check group privacy, pass if group is public or user is within that group
        if(post.group != null) {
            await this.groupService.privacyCheck(user, post.group._id)
        }

        const temp_post = await post.populate(
            [
                { path: 'user', select: 'first_name last_name avatar' },
                { path: 'likes' },
                { path: 'comments'}
            ]
        )

        // count likes and comments
        const obj_post = temp_post.toObject()
        const likes = obj_post.likes.length
        const comments = obj_post.comments.length

        delete obj_post.likes
        delete obj_post.comments
        return {
            ...obj_post,
            likes,
            comments
        }
    }

    async createPost(user: User, postDto: CreatePostDto) {
        // assign post creator
        postDto.user = user.id;

        // assign group if post is made within a group
        if(postDto.group) {
            const group = await this.groupService.getGroupById(postDto.group)
            if(!group) throw new HttpException('Invalid group id', HttpStatus.BAD_REQUEST);
        }
        const new_post = await this.postRepository.create(postDto)
        return new_post.populate({ path: 'user', select: 'first_name last_name avatar' })
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
        const updated_post = (await this.postRepository.findByIdAndUpdate(id, postDto)).populate(
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
        return (await updated_post).toObject()
    }

    async getAllPostsByUserId(id: string, page: number, limit: number = 10) {
        const count = await this.postRepository.countDocuments({ user: id, group: null })
        const count_page = Math.ceil(count / limit)
        const temp_posts = await this.postRepository.getByCondition(
            {
                user: id,
                group: null
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
        const posts = temp_posts.map(post => {
            const obj_post = post.toObject();
            const comments = obj_post.comments ? obj_post.comments.length : 0;
            const likes = obj_post.likes ? obj_post.likes.length : 0;
            delete obj_post.likes
            delete obj_post.comments

            return {
                ...obj_post,
                likes,
                comments,
            };
        });
        return {
            count, count_page, posts
        }
    }

    async privacyCheck(user: User, id: string) {
        return await this.groupService.privacyCheck(user, id)
    }

    async getAllPostsByGroupId(user: User, id: string, page: number, limit: number = 10) {
        const group = await this.groupService.getGroupById(id)
        if (!group) throw new HttpException('No group with this id', HttpStatus.NOT_FOUND);
         // check group privacy, pass if group is public or user is within that group
        await this.groupService.privacyCheck(user, group._id)
        
        const count = await this.postRepository.countDocuments({ group: id })
        const count_page = Math.ceil(count / limit)
        const temp_posts = await this.postRepository.getByCondition(
            { group: id },
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
            ]);
        const posts = temp_posts.map(post => {
            const obj_post = post.toObject();
            const comments = obj_post.comments ? obj_post.comments.length : 0;
            const likes = obj_post.likes ? obj_post.likes.length : 0;
            delete obj_post.likes
            delete obj_post.comments

            return {
                ...obj_post,
                likes,
                comments,
            };
        });
        return {
            count, count_page, posts
        }

    }
}
