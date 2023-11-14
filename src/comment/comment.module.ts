import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentSchema } from "./comment.model";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.service";
import { CommentRepository } from "./comment.repository";
import { PostModule } from "src/post/post.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Comment',
                schema: CommentSchema
            }
        ]),
        PostModule
    ],
    controllers: [CommentController],
    providers: [CommentService, CommentRepository],
    exports: [CommentService]

})
export class CommentModule { }
