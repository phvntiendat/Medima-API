import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GroupRepository } from './group.repository';
import { AdminPromotionDto, CreateGroupDto, UpdateGroupDto } from './group.dto';
import { User } from 'src/user/user.model';

@Injectable()
export class GroupService {
    constructor(private readonly groupRepository: GroupRepository) { }

    async createGroup(user: User, groupDto: CreateGroupDto) {
        // assign creator
        groupDto.creator = user.id;
        return await this.groupRepository.create(groupDto)
    }

    async getAllGroups(page: number, limit: number = 10) {
        const count = await this.groupRepository.countDocuments({})
        const count_page = Math.ceil(count / limit)
        const temp_groups = await this.groupRepository.getByCondition(
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

        const groups = temp_groups.map(group => {
            const obj_group = group.toObject();
            // count members and admins
            const members = obj_group.members ? obj_group.members.length : 0;
            const admins = obj_group.admins ? obj_group.admins.length : 0;
            delete obj_group.members
            delete obj_group.admins

            return {
                ...obj_group,
                members,
                admins
            };
        });
        
        return {
            count, count_page, groups
        }
    }

    async getGroupById(id: string) {
        return await this.groupRepository.findById(id)
    }

    async addMember(id: string, new_member: string) {
        const group = await this.groupRepository.findByConditionAndUpdate(id, {
            $push: { members: new_member },
        });
        return group
    }

    async adminPromotion(user: User, promotionDto: AdminPromotionDto) {
        const group = await this.getGroupById(promotionDto.group) 
        if(!group) throw new HttpException('Provided group Id does not exist', HttpStatus.NOT_FOUND);
        // accessible to only creator
        if(group.creator != user.id)  throw new HttpException('Group creator only', HttpStatus.UNAUTHORIZED);

        // must be a member first in order to be promoted
        const isMember = await this.groupRepository.findByCondition(
            {
                _id: promotionDto.group,
                members: { $in: [promotionDto.user] }
            }
        )
        
        if(!isMember) throw new HttpException('User is not a group member', HttpStatus.NOT_FOUND);
        return await this.groupRepository.findByConditionAndUpdate(group._id, {
            $pull: { members: promotionDto.user },
            $push: { admins: promotionDto.user },
        });
    
    }

    // access check for in-group posts/comments/replies
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

    async updateGroup(user: User, id: string, groupDto: UpdateGroupDto) {
        const group = await this.getGroupById(id) 
        if(!group) throw new HttpException('Provided group Id does not exist', HttpStatus.NOT_FOUND);
        // accessible to only creator
        if(group.creator != user.id)  throw new HttpException('Group creator only', HttpStatus.UNAUTHORIZED);
        return await this.groupRepository.findByIdAndUpdate(id, groupDto)
    }

    async deleteGroup(user: User, id: string) {
        const group = await this.getGroupById(id) 
        if(!group) throw new HttpException('Provided group Id does not exist', HttpStatus.NOT_FOUND);
        // accessible to only creator
        if(group.creator != user.id)  throw new HttpException('Group creator only', HttpStatus.UNAUTHORIZED);
        return await this.groupRepository.deleteOne(id)
    }
}
