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
} from '@nestjs/common';
import { FriendService } from './friends.service';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { logger } from '../../utils/logger';
import { BadRequestError, NotFoundError } from '../../utils/error.response';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiParam, ApiResponse } from '@nestjs/swagger';


@Controller('friends')
export class FriendsController {
    constructor(private readonly friendsService: FriendService) { }

    // Gửi lời mời kết bạn
    @ApiBearerAuth()
    @Post('request')
    @UseGuards(AccessTokenGuard)
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                toUser: { type: 'string', example: '6864a9116ea9d42e2cc9ae36' },
            },
            required: ['fromUser', 'toUser'],
        },
    })
    async sendRequest(@Body() body: { toUser: string }, @Req() req: Request) {
        const { toUser } = body;
        const userId = (req as any).user.userId;
        logger.info(`Sending friend request from userId:${userId} to userId:${toUser}`);
        const result = await this.friendsService.sendRequest(userId, toUser);
        return new SuccessResponse({
            message: 'Friend request sent successfully',
            metadata: result,
        });
    }
    // Chấp nhận lời mời kết bạn
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'id', required: true })
    @Post('accept/:id')
    @UseGuards(AccessTokenGuard)
    async acceptRequest(@Param('id') id: string, @Req() req: Request) {
        const toUser = (req as any).user.userId;
        logger.info(`Accepting requestId:${id}`);
        const result = await this.friendsService.acceptRequest(id, toUser);
        return new SuccessResponse({
            message: 'Friend request accepted',
            metadata: result,
        })

    }

    // Từ chối lời mời kết bạn
    @ApiBearerAuth()
    @Post('reject/:id')
    @ApiParam({ name: 'id', description: 'Id Friends', required: true })
    @UseGuards(AccessTokenGuard)
    async rejectRequest(@Param('id') requestId: string) {
        const result = await this.friendsService.rejectRequest(requestId);
        return new SuccessResponse({
            message: 'Friend request rejected',
            metadata: result,
        });

    }

    // Lấy danh sách yêu cầu đang chờ xác nhận
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Get('pending')
    async getPendingRequests(@Req() req: Request) {
        const userId = (req as any).user.userId;
        const result = await this.friendsService.getPendingRequests(userId);
        return new SuccessResponse({
            message: 'Pending friend requests fetched',
            metadata: result,
        });
    }


    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Get('requests/sent')
    async getRequestSent(@Req() req: Request) {
        const userId = (req as any).user.userId;
        const result = await this.friendsService.getRequestSent(userId);
        return new SuccessResponse({
            message: 'Sent friend requests fetched successfully',
            metadata: result,
        });
    }

    // Lấy danh sách bạn bè

    @ApiBearerAuth()
    @Get('list')
    @UseGuards(AccessTokenGuard)
    async getFriends(@Req() req: Request) {
        const userId = (req as any).user.userId;
        const result = await this.friendsService.getFriends(userId);
        return new SuccessResponse({
            message: 'Friend list fetched',
            metadata: {
                friends: result
            },
        });
    }
    
    //Huy loi moi ket bna
    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Post('cancel/:id')
    @ApiParam({ name: 'id', description: 'Id ', required: true })
    async cancelRequest(@Param('id') requestId: string, @Req() req: Request) {
        const userId = (req as any).user.userId;
        logger.info(`Cancelling requestId:${requestId} for userId:${userId}`);
        const result = await this.friendsService.cancelRequest(requestId, userId);
        return new SuccessResponse({
            message: 'Friend request cancelled successfully',
            metadata: result,
        });
        
    }

    @ApiBearerAuth()
    @UseGuards(AccessTokenGuard)
    @Post('unfriend/:id')
    @ApiParam({ name: 'id', description: 'Id ', required: true })
    async unFriends(@Param('id') requestId: string, @Req() req: Request) {
        const userId = (req as any).user.userId;
        logger.info(`Cancelling requestId:${requestId} for userId:${userId}`);
        const result = await this.friendsService.unFriend(requestId, userId);
        return new SuccessResponse({
            message: 'Friend request cancelled successfully',
            metadata: result,
        });

    }
}
