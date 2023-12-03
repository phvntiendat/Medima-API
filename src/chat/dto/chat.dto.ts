import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateChatDto {
    @IsNotEmpty()
    @ApiProperty({ example: '[id, id]' })
    participants: string[];
    sender: string;
    seen: boolean;
}

export class PaginationMessageDto {
    @ApiProperty({ required: false })
    @IsOptional()
    page: number;
    @ApiProperty({ required: false })
    @IsOptional()
    limit: number;
}

export class MessageByChatDto {
    @ApiProperty({ example: "chatid" })
    @IsNotEmpty()
    chat: string
}
