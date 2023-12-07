import { Body, Controller, Delete, HttpCode, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateRequestDto } from './request.dto';
import { RequestService } from './request.service';

@ApiTags('request')
@Controller('request')
export class RequestController {
    constructor(private readonly requestService: RequestService) { }

    @Post('create')
    @ApiBearerAuth()
    @HttpCode(201)
    @ApiCreatedResponse({ description: 'Request created.' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to create request.' })
    @UseGuards(AuthGuard('jwt'))
    async createRequest(@Req() req: any, @Body() request: CreateRequestDto) {
        return this.requestService.createRequest(req.user, request);
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to delete request.' })
    @ApiOkResponse({ description: 'Request deleted.' })
    @Delete('cancel/:id')
    async cancelRequest(@Req() req: any, @Param('id') id: string) {
        return this.requestService.cancelRequest(req.user, id)
    }

    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @ApiUnauthorizedResponse({ description: 'Unauthorized.' })
    @ApiBadRequestResponse({ description: 'Failed to confirm request.' })
    @ApiOkResponse({ description: 'Request confirmed.' })
    @Patch('confirm/:id')
    async confirmRequest(@Req() req: any, @Param('id') id: string) {
        return this.requestService.confirmRequest(req.user, id)
    }
}
