import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateCommentDto, CreateReplyDto, PaginationCommentDto, UpdateCommentDto } from './comment.dto';
import { CommentService } from './comment.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('comment')
@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @ApiBearerAuth()
    @HttpCode(201)
    @ApiOkResponse({ description: 'Comment created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create comment.' })
    @Post('create-comment')
    @UseGuards(AuthGuard('jwt'))
    async createComment(@Req() req: any, @Body() commentDto: CreateCommentDto) {
        return this.commentService.createComment(req.user, commentDto);
    }

    
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiOkResponse({ description: 'Reply created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to reply.' })
    @Post('create-reply')
    @UseGuards(AuthGuard('jwt'))
    async createReply(@Req() req: any, @Body() replyDto: CreateReplyDto) {
        return this.commentService.createReply(req.user, replyDto);
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Comments retrieved.' })
    @ApiNotFoundResponse({ description: 'No post with provided id.' })
    @Get('by-post/:id') 
    async getCommentByPostId(@Param('id') id: string, @Query() {page, limit}: PaginationCommentDto) {
        return this.commentService.getCommentByPostId(id, page, limit)
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Replies retrieved.' })
    @ApiNotFoundResponse({ description: 'No parent comment with provided id.' })
    @Get('reply/:id') 
    async getReplies(@Param('id') id: string, @Query() {page, limit}: PaginationCommentDto) {
        return this.commentService.getReplies(id, page, limit)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Comment updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update comment.' })
    @Patch('update/:id')
    async updateComment(@Req() req: any, @Param('id') id: string, @Body() comment: UpdateCommentDto) {
        return this.commentService.updateComment(req.user, id, comment)
    }
}
