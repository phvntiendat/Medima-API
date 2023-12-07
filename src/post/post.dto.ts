import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: 'Sample Title' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Sample Content' })
    @IsNotEmpty()
    content: string;

    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsNotEmpty()
    @IsUrl()
    image: string;
    user: any;

    @ApiProperty({ example: '6550fe61463641b890392053' })
    group: string;
}

export class UpdatePostDto {
    id: string;

    @ApiProperty({ example: 'Updated Title' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Updated Content' })
    @IsNotEmpty()
    content: string;
}


export class PaginationPostDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}