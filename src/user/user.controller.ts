import { Body, Controller, Get, HttpCode, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UpdatePasswordDto } from './dto/password.dto';
import { PaginationUserDto, UpdateUserDto } from './dto/user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }
    @HttpCode(200)
    @ApiOkResponse({ description: 'Users retrieved.' })
    @Get('search')
    async searchMentors(@Query('keyword') keyword: string, @Query() { page, limit }: PaginationUserDto) {
        return await this.userService.searchUser(keyword, page, limit);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({ description: 'User updated.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to update user.' })
    @Patch('update')
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
}