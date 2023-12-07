import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { AdminPromotionDto, CreateGroupDto } from './group.dto';
import { User } from 'src/user/user.model';

@Injectable()
export class GroupService {
    constructor(private readonly groupRepository: GroupRepository) { }

    async createGroup(user: User, groupDto: CreateGroupDto) {
        groupDto.creator = user.id;
        return await this.groupRepository.create(groupDto)
    }

    async getAllGroups(page: number, limit: number = 10) {
        const count = await this.groupRepository.countDocuments({})
        const countPage = Math.ceil(count / limit)
        const Pregroups = await this.groupRepository.getByCondition(
            {},
            null,
            {
                sort: {
                    createdAt: -1,
                },
                skip: (page - 1) * limit,
                limit: limit
            },
        );

        const groups = Pregroups.map(group => {
            const groupObject = group.toObject();
            const members = groupObject.members ? groupObject.members.length : 0;
            const admins = groupObject.admins ? groupObject.admins.length : 0;
            delete groupObject.members
            delete groupObject.admins

            return {
                ...groupObject,
                members,
                admins
            };
        });
        
        return {
            count, countPage, groups
        }
    }

    async getGroupById(id: string) {
        return await this.groupRepository.findById(id)
    }

    async addMember(groupId: string, newMemberId: string) {
        const group = await this.groupRepository.findByConditionAndUpdate(groupId, {
            $push: { members: newMemberId },
        });
        return group
    }

    async adminPromotion(user: User, promotionDto: AdminPromotionDto) {
        const group = await this.getGroupById(promotionDto.group) 
        if(!group) throw new HttpException('Provided group Id does not exist', HttpStatus.NOT_FOUND);
        if(group.creator != user.id)  throw new HttpException('Group creator only', HttpStatus.UNAUTHORIZED);
        const isMember = await this.groupRepository.findByCondition(
            {
                _id: promotionDto.group,
                members: { $in: [promotionDto.user] }
            }
        )
        // console.log(isMember);
        
        if(!isMember) throw new HttpException('User is not a group member', HttpStatus.NOT_FOUND);
        return await this.groupRepository.findByConditionAndUpdate(group._id, {
            $pull: { members: promotionDto.user },
            $push: { admins: promotionDto.user },
        });
    
    }

    async privacyCheck(user: User, id: string) {
        const group = await this.groupRepository.findById(id)
        if(group.public === false) {
            if(user === null || group.creator != user.id && !group.admins.includes(user.id) && !group.members.includes(user.id)) {
                throw new HttpException('This group is private', HttpStatus.UNAUTHORIZED);
            }
            return true
        }
        return true
    }
}
