import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';
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
        const post = await this.postService.getPostById(commentDto.post)
        if (!post) throw new HttpException('Invalid Post Id', HttpStatus.BAD_REQUEST);

        // add commenter
        commentDto.user = user.id

        const comment = await this.commentRepository.create(commentDto)
        return comment.populate({ path: 'user', select: 'first_name last_name avatar' })
    }

}
