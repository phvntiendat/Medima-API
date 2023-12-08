import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AdminPromotionDto, CreateGroupDto, PaginationGroupDto, UpdateGroupDto } from './group.dto';
import { GroupService } from './group.service';

@ApiTags('group')
@Controller('group')
export class GroupController {
    constructor(private readonly groupService: GroupService) { }

    @Get()
    @ApiOkResponse({ description: 'Groups retrieved.' })
    getAllGroups(@Query() { page, limit }: PaginationGroupDto) {
        return this.groupService.getAllGroups(page, limit);
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Group retrieved.' })
    @ApiNotFoundResponse({ description: 'No group with provided id.' })
    getGroupById(@Param('id') id: string) {
        return this.groupService.getGroupById(id);
    }

    @Post()
    @ApiBearerAuth()
    @ApiCreatedResponse({ description: 'Group created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create group.' })
    @UseGuards(AuthGuard('jwt'))
    async createGroup(@Req() req: any, @Body() group: CreateGroupDto) {
        return this.groupService.createGroup(req.user, group);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'User promoted.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to promote.' })
    @Patch('promote')
    async adminPromotion(@Req() req: any, @Body() promotionDto: AdminPromotionDto) {
        return this.groupService.adminPromotion(req.user, promotionDto)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to delete group.' })
    @ApiOkResponse({ description: 'Group deleted.' })
    @Delete(':id')
    async deleteGroup(@Req() req: any, @Param('id') id: string) {
        return this.groupService.deleteGroup(req.user, id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'Group updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update group.' })
    @Patch(':id')
    async updateGroup(@Req() req: any, @Param('id') id: string, @Body() group: UpdateGroupDto) {
        return this.groupService.updateGroup(req.user, id, group)
    }
    
}
