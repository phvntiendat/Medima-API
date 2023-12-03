import { Schema, Document } from "mongoose";

const GroupSchema = new Schema(
    {
        name: String,
        cover: String,
        public: Boolean,
        creator: String,
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
}