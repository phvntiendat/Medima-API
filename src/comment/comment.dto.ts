import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ example: 'Sample Comment' })
    @IsNotEmpty() content: string;
    @ApiProperty({ example: '65534f139bdc4cc070d14589' })
    @IsNotEmpty() @IsMongoId() post: string
    user: any;
}

export class CreateReplyDto {
    @ApiProperty({ example: 'Sample Reply' })
    @IsNotEmpty() content: string;
    user: any;
    @ApiProperty({ example: '655357da04357e1770124f16' })
    @IsNotEmpty()
    parent: string
    post: string
}

export class UpdateCommentDto {
    id: string;
    @ApiProperty({ example: 'Updated Comment' })
    @IsNotEmpty() content: string;
}

export class PaginationCommentDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}