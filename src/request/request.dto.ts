import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateRequestDto {
    @ApiProperty({ example: 'Sample Answer' })
    answer: string;
    @ApiProperty({ example: '6550fe61463641b890392053' })
    @IsNotEmpty()
    group: string;
    user: any;
}

export class PaginationRequestDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}