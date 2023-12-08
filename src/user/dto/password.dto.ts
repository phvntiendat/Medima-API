import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MaxLength, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({ example: '@Aassword123' })
    @MaxLength(20)
    @MinLength(6)
    @IsNotEmpty()
    new_password: string;

    @ApiProperty({ example: '@Assword123' })
    @MaxLength(20)
    @MinLength(6)
    @IsNotEmpty()
    old_password: string;
}