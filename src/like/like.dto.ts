import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateLikeDto {
    @ApiProperty({ example: '65534f139bdc4cc070d14589' })
    @IsNotEmpty()
    post: string;
    user: any;
}

export class CreateCommentLikeDto {
    @ApiProperty({ example: '65534f139bdc4cc070d14589' })
    @IsNotEmpty()
    comment: string;
    user: any;
}

export class PaginationLikeDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}