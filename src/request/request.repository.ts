import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from './request.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class RequestRepository extends BaseRepository<Request> {
    constructor(
        @InjectModel('Request')
        private readonly requestModel: Model<Request>,
    ) {
        super(requestModel);
    }
    async countDocuments(filter) {
        return this.requestModel.countDocuments(filter);
    }
}