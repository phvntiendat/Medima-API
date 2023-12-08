import { HttpException, HttpStatus, Inject, Injectable, forwardRef } from "@nestjs/common";
import { User } from "src/user/user.model";
import { ChatRepository } from "../repositories/chat.repository";
import { CreateChatDto } from "../dto/chat.dto";
import { EventGateway } from "src/event/event.gateway";

@Injectable()
export class ChatService {
    constructor(private readonly chatRepository: ChatRepository,
        @Inject(forwardRef(() => EventGateway)) private eventGateway: EventGateway,
    ) { }


    async createChat(user: User, chat: CreateChatDto) {
        const is_participant = chat.participants.find(id => id === user.id)
        // requested user must be in dto participants
        if (!is_participant) {
            throw new HttpException('You do not have permission for this action', HttpStatus.BAD_REQUEST);
        }

        // check if chat already existed
        const existed_chat = await this.chatRepository.findByCondition({
            participants: chat.participants
        })
        if (existed_chat) {
            throw new HttpException('Existed chat', HttpStatus.BAD_REQUEST);
        }
        const new_chat = await this.chatRepository.create(chat)
        return new_chat.populate({ path: 'participants', select: 'first_name last_name avatar' })

    }

    // get chat by current user
    async getUserChats(user: User) {
        const chats = await this.chatRepository.getByCondition(
            {
                participants: {
                    $elemMatch: { $eq: user._id }
                },
            },
            null,
            null,
            { path: 'participants', select: 'first_name last_name avatar' }
        )
        return chats
    }

    // seen status
    async setSeenLatestMessage(user: User, id: string) {
        const chatCheck = await this.chatRepository.findById(id)
        const isParticipant = chatCheck.participants.some(participant => participant._id.toString() === user._id.toString());
        if (!isParticipant) throw new HttpException('No Permission', HttpStatus.UNAUTHORIZED);

        // must be the other end user
        const chat = await this.chatRepository.findByIdAndUpdate(id, {
            seen: true
        })

        this.eventGateway.seenStatus(chat)
        return chat
    }
}
