import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreateGroupDto {
    @ApiProperty({ example: 'Sample Title' })
    @IsNotEmpty()
    name: string

    @ApiProperty({ example: true })
    @IsNotEmpty()
    public: boolean

    @ApiProperty({ example: 'Sample Description' })
    @IsNotEmpty()
    description: string

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsNotEmpty()
    @IsUrl()
    cover: string;

    creator: any;
}

export class UpdateGroupDto {
    @ApiProperty({ example: 'Sample Title' })
    name: string

    @ApiProperty({ example: true })
    public: boolean

    @ApiProperty({ example: 'Sample Description' })
    description: string

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsUrl()
    cover: string;
}


export class PaginationGroupDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}

export class AdminPromotionDto {
    @ApiProperty({ required: false })
    @IsNotEmpty()
    user: string;
    @ApiProperty({ required: false })
    @IsNotEmpty()
    group: string;
}