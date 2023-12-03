import { Body, Controller, Get, HttpCode, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateMessageDto } from '../dto/message.dto';
import { MessageService } from '../services/message.service.';
import { ApiBearerAuth, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { MessageByChatDto, PaginationMessageDto } from '../dto/chat.dto';

@ApiTags('message')
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @ApiBearerAuth()
    @HttpCode(201)
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
    @HttpCode(200)
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to retrieve messages.' })
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Messages retrieved.' })
    getAllMessageByChatId(@Req() req: any, @Body() dto: MessageByChatDto, @Query() { page, limit }: PaginationMessageDto) {
        return this.messageService.getAllMessageByChatId(req.user, dto, page, limit);
    }


}
