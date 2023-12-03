import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreatePostDto, PaginationPostDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get('all')
    @HttpCode(200)
    @ApiOkResponse({ description: 'Posts retrieved.' })
    getAllPosts(@Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPosts(page, limit);
    }

    @Get(':id')
    @HttpCode(200)
    @ApiOkResponse({ description: 'Post retrieved.' })
    @ApiNotFoundResponse({ description: 'No post with provided id.' })
    getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }

    @Post('create')
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiOkResponse({ description: 'Post created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create post.' })
    @UseGuards(AuthGuard('jwt'))
    async createPost(@Req() req: any, @Body() post: CreatePostDto) {
        return this.postService.createPost(req.user, post);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to delete post.' })
    @ApiOkResponse({ description: 'Post deleted.' })
    @Delete('delete/:id')
    async deletePost(@Req() req: any, @Param('id') id: string) {
        return this.postService.deletePost(req.user, id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Post updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update post.' })
    @Patch('update/:id')
    async updatePost(@Req() req: any, @Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postService.updatePost(req.user, id, post)
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Post retrieved.' })
    @ApiNotFoundResponse({ description: 'No user with provided id.' })
    @Get('by-user/:id')
    async getAllPostsByUserId(@Param('id') id: string, @Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPostsByUserId(id, page, limit)
    }
}
