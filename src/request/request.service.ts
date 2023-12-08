import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateRequestDto } from './request.dto';
import { User } from 'src/user/user.model';
import { RequestRepository } from './request.repository';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class RequestService {
    constructor(
        private readonly requestRepository: RequestRepository,
        private readonly groupService: GroupService
    ) { }

    async createRequest(user: User, requestDto: CreateRequestDto) {
        requestDto.user = user.id;
        const group = await this.groupService.getGroupById(requestDto.group)
        if(!group) throw new HttpException('Invalid group id', HttpStatus.BAD_REQUEST);
        if(group.creator == user.id || group.admins.includes(user.id) || group.members.includes(user.id))
        {
            throw new HttpException('Already joined', HttpStatus.BAD_REQUEST);
        }

        const check = await this.requestRepository.findByCondition(
            {
                group: requestDto.group,
                user: user.id
            }
        )
        if(check) throw new HttpException('Existed Request', HttpStatus.BAD_REQUEST);

        return await this.requestRepository.create(requestDto)
    }

    async confirmRequest(user: User, id: string) {
        const request = await this.requestRepository.findById(id)
        if (!request) throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
        const group = await this.groupService.getGroupById(request.group._id)
        if(group.creator != user.id && !group.admins.includes(user.id)) {
            throw new HttpException('Only group creator and admins has permission', HttpStatus.BAD_REQUEST);
        }
        await this.groupService.addMember(request.group._id, request.user._id)
        return await this.requestRepository.deleteOne(id)
    }

    async cancelRequest(user: User, id: string) {
        const request = await this.requestRepository.findById(id)
        if (!request) throw new HttpException('No request with this id', HttpStatus.NOT_FOUND);
        const group = await this.groupService.getGroupById(request.group._id)
        if(group.creator != user.id && !group.admins.includes(user.id) && request.user != user.id) {
            throw new HttpException('No permission', HttpStatus.BAD_REQUEST);
        }
        return await this.requestRepository.deleteOne(id)
    }

    async getAllRequestsByGroup(user: User, id: string, page: number, limit: number = 10) {
        const group = await this.groupService.getGroupById(id)
        if(group.creator != user.id && !group.admins.includes(user.id)) {
            throw new HttpException('Only group creator and admins has permission', HttpStatus.BAD_REQUEST);
        }     
        const count = await this.requestRepository.countDocuments({_id: id})
        const count_page = Math.ceil(count / limit)
        const requests = await this.requestRepository.getByCondition(
            {
                _id: id
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
                path: 'user',
                select: 'first_name last_name email avatar'
            }
        )
        return {
            count, count_page, requests
        }

    }
}
