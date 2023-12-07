import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RequestSchema } from "./request.model";
import { RequestController } from "./request.controller";
import { RequestService } from "./request.service";
import { RequestRepository } from "./request.repository";
import { GroupModule } from "src/group/group.module";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Request',
                schema: RequestSchema
            }
        ]),
        GroupModule
    ],

    controllers: [RequestController],
    providers: [RequestService, RequestRepository],
    exports: [RequestService]

})
export class RequestModule { }
