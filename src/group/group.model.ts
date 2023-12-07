import { Schema, Document } from "mongoose";
import { User } from "src/user/user.model";

const GroupSchema = new Schema(
    {
        name: String,
        cover: String,
        public: Boolean,
        creator: String,
        description: String,
        members: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        
        admins: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
    },
    {
        collection: 'groups',
    }
)

export { GroupSchema };
export interface Group extends Document {
    name: string,
    cover: string,
    public: boolean,
    creator: string,
    description: string,
    members: [User]
    admins: [User]
}