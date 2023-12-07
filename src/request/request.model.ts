import { Schema, Document } from "mongoose";
import { Group } from "src/group/group.model";
import { User } from "src/user/user.model";

const RequestSchema = new Schema(
    {
        answer: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        },
    },
    {
        timestamps: true,
        collection: 'requests',
        toObject: { virtuals: true }
    }
)

export { RequestSchema };
export interface Request extends Document {
    answer: string;
    user: User;
    group: Group
}