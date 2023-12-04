import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./post.model";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Post',
                schema: PostSchema
            }
        ]),
    ],

    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostService]

})
export class PostModule { }
