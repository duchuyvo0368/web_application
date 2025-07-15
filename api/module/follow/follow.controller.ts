import { Controller, Post, Body, Patch, UseGuards, Req, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';
import { SuccessResponse } from 'utils/success.response';
import { ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { AccessTokenGuard } from 'module/auth/guards/access-token.guard';
import { logger } from 'utils/logger';


@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    
    @Post('/:userId/follow')
    async followHandler(
        @Param('id') targetUserId: string,
        @Body('action') action: 'follow' | 'unfollow',
        @Req() req: Request
    ) {
        const userId = (req as any).user.userId;
        const message = await this.followService.handleFollowAction(userId, targetUserId, action);

        return new SuccessResponse({ message });
    }


    

}
