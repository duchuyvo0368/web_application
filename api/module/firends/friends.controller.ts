import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    Req,
    UseGuards,
    HttpCode,
    Patch,
    BadRequestException,
    Query,
    Delete,
    DefaultValuePipe,
    ParseIntPipe,
} from '@nestjs/common';
import { FriendService } from './friends.service';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { logger } from '../../utils/logger';
import { BadRequestError, NotFoundError } from '../../utils/error.response';

import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'module/auth/guards/access-token.guard';


@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendService) { }




    // nhưng lơì mời bạn đã gửi
    @Get('')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiQuery({
        name: 'type',
        enum: ['all', 'sent', 'pending'],
        required: true,
        description: 'all = all accepted friends, sent = sent friend requests, pending = received pending friend requests',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Limit number of results (optional, default = 10)',
    })
    async getFriendList(
        @Query('type') type: 'all' | 'sent' | 'pending', @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Req() req: Request,
    ) {

        const userId = (req as any).user.userId;
        const result = await this.friendsService.getFriendListByType(userId, type, limit);

        let message = '';
        switch (type) {
            case 'all':
                message = 'Friend list fetched successfully';
                break;
            case 'sent':
                message = 'Sent friend requests fetched successfully';
                break;
            case 'pending':
                message = 'Pending friend requests fetched successfully';
                break;
            default:
                throw new BadRequestException('Invalid type');
        }

        return new SuccessResponse({
            message,
            metadata: result,
        });
    }




    // Gửi lời mời kết bạn
    @Post('/update-status')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                userId: {
                    type: 'string',
                    example: 'abc123',
                },
                type: {
                    type: 'string',
                    enum: ['accept', 'reject', 'deleted', 'send', 'unfriend'],
                    example: 'send',
                    description:
                        'accept = đồng ý, reject = từ chối, deleted = xóa bạn, send = gửi lời mời, unfriend = hủy kết bạn',
                },
            },
            required: ['userId', 'type'],
        },
    })

    async handleFriendRequestStatus(@Body('userId') toUser: string, @Body('type') type: 'accept' | 'reject' | 'deleted' | 'unfriend' | 'send' | 'follow' | 'unfollow', @Req() req: Request) {
        const fromUser = (req as any).user.userId;
        logger.info(`Accepting requestId:${fromUser} and ${toUser} with action: ${type}`);
        const result = await this.friendsService.handleFriendRequestAction(fromUser, toUser, type);
        return new SuccessResponse({
            message: result.message,
            metadata: result,
        });

    }




}



