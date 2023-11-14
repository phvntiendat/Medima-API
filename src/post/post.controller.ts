import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePostDto, PaginationPostDto, UpdatePostDto } from './post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get('all')
    getAllPosts(@Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPosts(page, limit);
    }

    @Get(':id')
    getPostById(@Param('id') id: string) {
        return this.postService.getPostById(id);
    }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createPost(@Req() req: any, @Body(new ValidationPipe()) post: CreatePostDto) {
        return this.postService.createPost(req.user, post);
    }


    @UseGuards(AuthGuard("jwt"))
    @Delete('delete/:id')
    async deletePost(@Req() req: any, @Param('id') id: string) {
        return this.postService.deletePost(req.user, id)
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch('update/:id')
    async updatePost(@Req() req: any, @Param('id') id: string, @Body(new ValidationPipe()) post: UpdatePostDto) {
        return this.postService.updatePost(req.user, id, post)
    }

    @Get('by-user/:id')
    async getAllPostsByUserId(@Param('id') id: string, @Query() { page, limit }: PaginationPostDto) {
        return this.postService.getAllPostsByUserId(id, page, limit)
    }

}
