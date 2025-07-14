import { Controller, Post, Body, Patch, UseGuards, Req } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { FollowService } from './follow.service';
import { SuccessResponse } from 'utils/success.response';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AccessTokenGuard } from 'module/auth/guards/access-token.guard';
import { logger } from 'utils/logger';


@Controller('follow')
export class FollowController {
    constructor(private readonly followService: FollowService) { }

    
    @UseGuards(AccessTokenGuard)
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                followerId: { type: 'string', example: '6868fe4f4f68d069df5191e8' },
            },
            required: ['followerId'],
        },
    })
    @Post('create')
    async create(followerId:string, @Req() req:Request) {
        const userId = (req as any).user.userId; // Assuming you have userId in the request
        logger.info(`Creating follow relation from userId:${userId} to followerId:${followerId}`);
        const createFollow = this.followService.createFollow(userId, followerId);
        return new SuccessResponse({
            message: 'Follow relation created successfully', 
            metadata: {
                follow: createFollow,
            },
        })
    }
    @UseGuards(AccessTokenGuard)
    @Patch('unfollow')
    async unfollow(@Body() following:string, req: Request) {
        const userId = (req as any).user.userId;
        const unfollow = await this.followService.unfollow(userId, following);
        return new SuccessResponse({
            message: 'Unfollow relation created successfully',
            metadata: {
                follow: unfollow,
            },
        });
    }
    // Additional endpoints can be added here for other follow-related actions
    // For example, to get followers, following, etc.
    

}
