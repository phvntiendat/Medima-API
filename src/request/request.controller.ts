import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateRequestDto, PaginationRequestDto } from './request.dto';
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

    @ApiOkResponse({ description: 'Request retrieved.' })
    @ApiNotFoundResponse({ description: 'No group with provided id.' })
    @ApiBearerAuth()
    @UseGuards(AuthGuard("jwt"))
    @Get('by-group/:id')
    async getAllRequestsByGroup(@Req() req: any, @Param('id') id: string,  @Query() {page, limit}: PaginationRequestDto) {
        return this.requestService.getAllRequestsByGroup(req.user, id, page, limit);
    }
}
