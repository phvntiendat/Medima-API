import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/base.repository';
import { CommentLike } from '../like.model';

@Injectable()
export class CommentLikeRepository extends BaseRepository<CommentLike> {
    constructor(
        @InjectModel('CommentLike')
        private readonly commentlikeModel: Model<CommentLike>,
    ) {
        super(commentlikeModel);
    }
    async countDocuments(filter) {
        return this.commentlikeModel.countDocuments(filter);
    }
}