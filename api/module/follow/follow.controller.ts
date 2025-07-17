import { Controller, Post, Body, Patch, UseGuards, Req, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';
import { SuccessResponse } from 'utils/success.response';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'module/auth/guards/access-token.guard';
import { logger } from 'utils/logger';
import { log } from 'console';


@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }


    @ApiParam({ name: 'userId', required: true })
    @ApiParam({ name: 'action', enum: ['addfollow', 'unfollow'] })
    @UseGuards(AccessTokenGuard)
    @Post('/:userId/action/:action')
    async followHandler(
        @Param('userId') targetUserId: string,
        @Param('action') action: 'addfollow' | 'unfollow',
        @Req() req: Request
    ) {

        const userId = (req as any).user.userId;
        logger.info(`Follow action: ${action} for user: ${targetUserId} and: from user: ${userId}`);
        const result = await this.followService.handleFollowAction(userId, targetUserId, action);

        return new SuccessResponse({
            metadata: result,
            message:result.message
        });
    }
   

}
