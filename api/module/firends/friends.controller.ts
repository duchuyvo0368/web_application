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
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';


@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendService) { }




    // nhưng lơì mời bạn đã gửi
    @Get('list/:type')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @ApiParam({
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
        @Param('type') type: 'all' | 'sent' | 'pending' , @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
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
    @Post('requests/:userId/action/:action')
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @ApiParam({
        name: 'action',
        enum: ['accept', 'reject', 'deleted', 'send', 'unfriend'],
        required: true,
        description: 'accept = Accept friend request, reject = Reject friend request, cancel = Cancel sent request, send = Send friend request',
    })
    async handleFriendRequestStatus(@Param('userId') toUser: string, @Param('action') action: 'accept' | 'reject' | 'deleted' | 'unfriend' | 'send', @Req() req: Request) {
        const fromUser = (req as any).user.userId;
        logger.info(`Accepting requestId:${fromUser} and ${toUser} with action: ${action}`);
        const result = await this.friendsService.handleFriendRequestAction(fromUser, toUser, action);
        return new SuccessResponse({
            message: result.message,
            metadata: result,
        });

    }




}



