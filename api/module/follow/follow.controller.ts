import { Controller, Post, Body, Patch, UseGuards, Req, Param, Delete, BadRequestException } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';
import { SuccessResponse } from 'utils/success.response';
import { logger } from 'utils/logger';
import { log } from 'console';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';


@ApiTags('Friends')
@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }


    // @ApiBody({
    //     schema: {
    //         type: 'object',
    //         properties: {
    //             userId: {
    //                 type: 'string',
    //                 example: 'abc123',
    //             },
    //             status: {
    //                 type: 'string',
    //                 enum: ['addfollow', 'unfollow'],
    //                 example: 'addfollow',
    //             },
    //         },
    //         required: ['userId', 'action'],
    //     },
    // })

    // @UseGuards(AuthGuard)
    // @Post('')
    // async followHandler(
    //     @Body('userId') targetUserId: string,
    //     @Body('status') status: 'addfollow' | 'unfollow',
    //     @Req() req: Request
    // ) {

    //     const userId = (req as any).user.userId;
    //     logger.info(`Follow action: ${status} for user: ${targetUserId} and: from user: ${userId}`);
    //     const result = await this.followService.handleFollowAction(userId, targetUserId, status);

    //     return new SuccessResponse({
    //         metadata: result,
    //         message:result.message
    //     });
    // }
   

}
