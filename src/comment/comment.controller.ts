import { Body, Controller, Post, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto } from './comment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createComment(@Req() req: any, @Body(new ValidationPipe()) commentDto: CreateCommentDto) {
        return this.commentService.createComment(req.user, commentDto);
    }
}
