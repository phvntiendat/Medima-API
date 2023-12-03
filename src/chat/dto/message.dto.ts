import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMessageDto {
    @ApiProperty({ example: 'Hi there' })
    @IsNotEmpty()
    content: string;
    @ApiProperty({ example: '656b31902f9fda6683b2c9c2' })
    @IsNotEmpty()
    chat: string;
    sender: string;
}
