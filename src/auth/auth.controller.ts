import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateUserDto, ForgotPasswordDto, LoginUserDto, RefreshTokenDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(201)
    @ApiCreatedResponse({ description: 'User created.' })
    @ApiBadRequestResponse({ description: 'Failed to register user.' })
    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    @ApiOkResponse({ description: 'Login successful.' })
    @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.authService.login(loginUserDto);
    }

    @UseGuards(AuthGuard("jwt"))
    @HttpCode(200)
    @ApiOkResponse({ description: 'Logout successful.' })
    @ApiUnauthorizedResponse({ description: 'Unanthorized.' })
    @Post('logout')
    @ApiBearerAuth()
    async logout(@Req() req: any) {
        return await this.authService.logout(req.user)
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Token Refreshed.' })
    @Post('refresh')
    async refresh(@Body() refreshTokenDto: RefreshTokenDto ) {
        return await this.authService.refresh(refreshTokenDto.refresh_token);
    }

    @HttpCode(200)
    @ApiOkResponse({ description: 'Email sent.' })
    @ApiBadRequestResponse({ description: 'Email does not exist.' })
    @Post('forgot-password')
    async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
        return await this.authService.forgotPassword(forgotPasswordDto.email)
    }

}