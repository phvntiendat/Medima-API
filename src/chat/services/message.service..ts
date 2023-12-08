import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "src/user/user.model";
import { CreateMessageDto } from "../dto/message.dto";
import { MessageRepository } from "../repositories/message.repository";
import { EventGateway } from "src/event/event.gateway";
import { ChatRepository } from "../repositories/chat.repository";
import { MessageByChatDto } from "../dto/chat.dto";

@Injectable()
export class MessageService {
    constructor(private readonly messageRepository: MessageRepository,
        private readonly chatRepository: ChatRepository,
        private eventGateway: EventGateway
    ) { }


    async createMessage(user: User, message: CreateMessageDto) {
        // handle chat participants logic  
        // chat exist
        const chatExist = await this.chatRepository.findById(message.chat)
        if (!chatExist) throw new HttpException('Invalid chat', HttpStatus.BAD_REQUEST);

        message.sender = user._id
        const created_message = await this.messageRepository.create(message)
        await this.chatRepository.findByIdAndUpdate(message.chat, {
            latest_message: message.content,
            seen: false,
            sender: user.id
        })

        this.eventGateway.sendNewMessage(created_message)
        return created_message
    }

    async getAllMessageByChatId(user: User, dto: MessageByChatDto, page: number = 1, limit: number = 10) {
        // participants only

        const chat_check = await this.chatRepository.findById(dto.chat)
        const is_participant = chat_check.participants.some(participant => participant._id.toString() === user._id.toString());
        if (!is_participant) throw new HttpException('No Permission', HttpStatus.UNAUTHORIZED);

        const count = await this.messageRepository.countDocuments({chat: dto.chat})
        const count_page = Math.ceil(count / limit)
        const messages = await this.messageRepository.getByCondition(
            {
                chat: dto.chat
            },
            null,
            {
                sort: {
                    createdAt: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
            { 
                path: 'sender', select: 'first_name last_name avatar',
            }
        )
        return {
            count, count_page, messages
        }
    }
}
