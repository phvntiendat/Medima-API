import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateCommentLikeDto, CreateLikeDto, PaginationLikeDto } from './like.dto';
import { LikeService } from './like.service';

@ApiTags('like')
@Controller('like')
export class LikeController {
    constructor(private readonly likeService: LikeService) { }

    @Post()
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Like created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create like.' })
    @UseGuards(AuthGuard('jwt'))
    async createLike(@Req() req: any, @Body() like: CreateLikeDto) {
        return this.likeService.createLike(req.user, like);
    }

    @Post('comment')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Like created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create like.' })
    @UseGuards(AuthGuard('jwt'))
    async createCommentLike(@Req() req: any, @Body() like: CreateCommentLikeDto) {
        return this.likeService.createCommentLike(req.user, like);
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Likes retrieved.' })
    @ApiNotFoundResponse({ description: 'No post with provided id.' })
    @Get('by-post/:id')
    async getLikesByPostId(@Param('id') id: string,  @Query() {page, limit}: PaginationLikeDto) {
        return this.likeService.getLikesByPostId(id, page, limit);
    }

    @ApiOkResponse({ description: 'Likes retrieved.' })
    @ApiNotFoundResponse({ description: 'No comment with provided id.' })
    @Get('by-comment/:id')
    async getLikesByCommentId(@Param('id') id: string,  @Query() {page, limit}: PaginationLikeDto) {
        return this.likeService.getLikesByCommentId(id, page, limit);
    }
}
