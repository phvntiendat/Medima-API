import { Body, Controller, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateChatDto, PaginationMessageDto } from '../dto/chat.dto';
import { ChatService } from '../services/chat.service';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @ApiBearerAuth()
    @HttpCode(201)
    @ApiOkResponse({ description: 'Chat/Room created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create chat/room.' })
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createChat(@Req() req: any, @Body() chat: CreateChatDto) {
        return this.chatService.createChat(req.user, chat);
    }

    @Get()
    @HttpCode(200)
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create chat/room.' })
    @ApiOkResponse({ description: 'Chats/Rooms retrieved.' })
    @UseGuards(AuthGuard('jwt'))
    async getUserChats(@Req() req: any) {
        return this.chatService.getUserChats(req.user);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Set seen on latest message.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Bad request.' })
    @UseGuards(AuthGuard('jwt'))
    async setSeenLatestMessage(@Req() req: any, @Param('id') id: string) {
        return this.chatService.setSeenLatestMessage(req.user, id);
    }

}
