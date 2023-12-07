import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class UpdatePasswordDto {
    @ApiProperty({ example: '@Aassword123' })
    @MinLength(6)
    @IsNotEmpty()
    @MinLength(6) @IsNotEmpty() new_password: string;

    @ApiProperty({ example: '@Assword123' })
    @MinLength(6)
    @IsNotEmpty()
    @MinLength(6) @IsNotEmpty() old_password: string;
}