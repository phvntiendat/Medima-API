import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty() first_name: string;
    @IsNotEmpty() last_name: string;
    @IsEmail() @IsNotEmpty() email: string;
    @MinLength(6) @IsNotEmpty() password: string;
    @IsNotEmpty() date_of_birth: Date;
    @IsNotEmpty() phone: string;
    @IsNotEmpty() gender: boolean;
    avatar: string;
    role: string;
}

export class LoginUserDto {
    @IsEmail() @IsNotEmpty() email: string;
    @MinLength(6) @IsNotEmpty() password: string;
}
