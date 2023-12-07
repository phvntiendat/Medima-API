import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { GroupSchema } from "./group.model";
import { GroupController } from "./group.controller";
import { GroupService } from "./group.service";
import { GroupRepository } from "./group.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Group',
                schema: GroupSchema
            }
        ]),
    ],

    controllers: [GroupController],
    providers: [GroupService, GroupRepository],
    exports: [GroupService]

})
export class GroupModule { }
