import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './comment.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<Comment>,
    ) {
        super(commentModel);
    }
    async countDocuments(filter) {
        return this.commentModel.countDocuments(filter);
    }
}