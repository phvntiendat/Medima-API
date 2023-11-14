import { IsNotEmpty, IsUrl } from "class-validator";

export class CreatePostDto {
    @IsNotEmpty() title: string;
    @IsNotEmpty() content: string;
    @IsNotEmpty() @IsUrl() image: string;
    user: any;
}

export class UpdatePostDto {
    id: string;
    @IsNotEmpty() title: string;
    @IsNotEmpty() content: string;
}

export class PaginationPostDto {
    @IsNotEmpty()
    page: number;
    @IsNotEmpty()
    limit: number;
}