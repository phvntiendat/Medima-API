import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from './like.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class LikeRepository extends BaseRepository<Like> {
    constructor(
        @InjectModel('Like')
        private readonly likeModel: Model<Like>,
    ) {
        super(likeModel);
    }
    async countDocuments(filter) {
        return this.likeModel.countDocuments(filter);
    }
}