import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreatePostDto, PaginationPostDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';

@ApiTags('post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get()
    @ApiOkResponse({ description: 'Posts retrieved.' })
    getAllPosts(@Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPosts(page, limit);
    }

    @Get('by-group/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Posts retrieved.' })
    @ApiNotFoundResponse({ description: 'No group with provided id.' })
    getAllPostsByGroupId(@Req() req: any, @Param('id') id: string, @Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPostsByGroupId(req.user, id, page, limit);
    }


    @Get(':id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Post retrieved.' })
    @ApiNotFoundResponse({ description: 'No post with provided id.' })
    getPostById(@Req() req: any, @Param('id') id: string) {
        return this.postService.getPostById(req.user, id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Post created.' })
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
    @Delete(':id')
    async deletePost(@Req() req: any, @Param('id') id: string) {
        return this.postService.deletePost(req.user, id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Post updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update post.' })
    @Patch(':id')
    async updatePost(@Req() req: any, @Param('id') id: string, @Body() post: UpdatePostDto) {
        return this.postService.updatePost(req.user, id, post)
    }

    @ApiOkResponse({ description: 'Post retrieved.' })
    @ApiNotFoundResponse({ description: 'No user with provided id.' })
    @Get('by-user/:id')
    async getAllPostsByUserId(@Param('id') id: string, @Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPostsByUserId(id, page, limit)
    }
}
