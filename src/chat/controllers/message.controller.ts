import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { MessageByChatDto, PaginationMessageDto } from '../dto/chat.dto';
import { CreateMessageDto } from '../dto/message.dto';
import { MessageService } from '../services/message.service.';

@ApiTags('message')
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Message sent.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to send message.' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createMessage(@Req() req: any, @Body() message: CreateMessageDto) {
        return this.messageService.createMessage(req.user, message); 
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to retrieve messages.' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Messages retrieved.' })
    getAllMessageByChatId(@Req() req: any, @Body() dto: MessageByChatDto, @Query() { page, limit }: PaginationMessageDto) {
        return this.messageService.getAllMessageByChatId(req.user, dto, page, limit);
    }


}
