import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Dat' })
    @IsNotEmpty()
    first_name: string;

    @ApiProperty({ example: 'Phan' })
    @IsNotEmpty()
    last_name: string;

    @ApiProperty({ example: 'email@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: '1990-01-01' })
    @IsNotEmpty()
    date_of_birth: Date;

    @ApiProperty({ example: '1234567890' })
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: true })
    @IsNotEmpty()
    gender: boolean;

    @ApiProperty({ example: 'url-to-avatar-image' })
    avatar: string;

    @ApiProperty({ example: 'user' })
    role: string;
}

export class LoginUserDto {
    @ApiProperty({ example: 'email@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123' })
    @MinLength(6)
    @IsNotEmpty()
    password: string;
}

export class RefreshTokenDto {
    @ApiProperty({ example: 'refreshtoken' })
    @IsNotEmpty()
    refresh_token: string
}

export class PaginationUserDto {
    page: number;
    limit: number;
}

export class UpdateUserDto {
    @ApiProperty({ example: 'Dat' })
    first_name: string;

    @ApiProperty({ example: 'Phan' })
    last_name: string;

    @ApiProperty({ example: '1990-01-01' })
    date_of_birth: Date;

    @ApiProperty({ example: '1234567890' })
    phone: string;

    @ApiProperty({ example: true })
    gender: boolean;

    @ApiProperty({ example: 'url-to-avatar-image' })
    avatar: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'email@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

