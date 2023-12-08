import { Body, Controller, Get, HttpCode, Param, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/password.dto';
import { PaginationUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @ApiOkResponse({ description: 'Users retrieved.' })
    @Get('search')
    async searchUser(@Query('keyword') keyword: string, @Query() { page, limit }: PaginationUserDto) {
        return await this.userService.searchUser(keyword, page, limit);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'User updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update user.' })
    @Patch()
    async updateUser(@Req() req: any, @Body() userDto: UpdateUserDto) {
        return this.userService.updateUser(req.user, userDto )
    }

    @ApiBearerAuth()
    @ApiOkResponse({ description: 'Password updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update password.' })
    @UseGuards(AuthGuard('jwt'))
    @Patch('change-password')
    async changePassword(@Req() req: any, @Body() passwordDto: UpdatePasswordDto) {
        return this.userService.changePassword(req.user, passwordDto);
    }

    @ApiOkResponse({ description: 'Profile retrieved.' })
    @ApiBearerAuth()
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @UseGuards(AuthGuard('jwt'))
    @Get('profile')
    async getProfile(@Req() req: any) {
        return await this.userService.getProfile(req.user)
    }

    @ApiOkResponse({ description: 'User retrieved.' })
    @ApiNotFoundResponse({ description: 'No user with this id.' })
    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return await this.userService.getUserById(id)
    }
}