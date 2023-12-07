import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PostSchema } from "./post.model";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { PostRepository } from "./post.repository";
import { GroupModule } from "src/group/group.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Post',
                schema: PostSchema
            }
        ]),
        GroupModule
    ],

    controllers: [PostController],
    providers: [PostService, PostRepository],
    exports: [PostService]

})
export class PostModule { }
