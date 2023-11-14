import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateCommentDto {
    @IsNotEmpty() content: string;
    @IsNotEmpty() @IsMongoId() post: string
    user: any;
}

export class UpdateCommentDto {
    id: string;
    @IsNotEmpty() content: string;
}

export class PaginationCommentDto {
    @IsNotEmpty()
    page: number;
    @IsNotEmpty()
    limit: number;
}