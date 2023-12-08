import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentLikeSchema, LikeSchema } from "./like.model";
import { LikeService } from "./like.service";
import { LikeController } from "./like.controller";
import { PostModule } from "src/post/post.module";
import { CommentModule } from "src/comment/comment.module";
import { LikeRepository } from "./repositories/like.repository";
import { CommentLikeRepository } from "./repositories/commentlike.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Like',
                schema: LikeSchema
            },
            {
                name: 'CommentLike',
                schema: CommentLikeSchema
            }
        ]),
        PostModule,
        CommentModule
    ],

    controllers: [LikeController],
    providers: [LikeService, LikeRepository, CommentLikeRepository],
    exports: [LikeService]

})
export class LikeModule { }
