import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateChatDto } from '../dto/chat.dto';
import { ChatService } from '../services/chat.service';

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Chat/Room created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create chat/room.' })
    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createChat(@Req() req: any, @Body() chat: CreateChatDto) {
        return this.chatService.createChat(req.user, chat);
    }

    @Get()
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
