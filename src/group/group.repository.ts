import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Group } from './group.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class GroupRepository extends BaseRepository<Group> {
    constructor(
        @InjectModel('Group')
        private readonly groupModel: Model<Group>,
    ) {
        super(groupModel);
    }
    async countDocuments(filter) {
        return this.groupModel.countDocuments(filter);
    }
}