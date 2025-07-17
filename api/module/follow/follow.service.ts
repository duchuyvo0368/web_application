import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowRelation } from './entities/follow.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Model } from 'mongoose';
import { find } from 'lodash';
import { BadRequestError, ConflictRequestError, NotFoundError } from 'utils/error.response';
import { log } from 'console';
import { logger } from 'utils/logger';
import { UserService } from 'module/user/user.service';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follow.name, 'MONGODB_CONNECTION')
        private readonly followModel: Model<FollowRelation>,
        private readonly userService: UserService, // Assuming you have a UserService to fetch user details
    ) { }
    async findByIdFollow(fromUser: string): Promise<FollowRelation | null> {
        return this.followModel.findOne({
            $or: [
                { followingId: fromUser },

            ]
        }).lean();
    }
    async createFollow(fromUser: string, targetUserId: string): Promise<any> {
        if (fromUser === targetUserId) {
            throw new BadRequestError('Cannot follow yourself');
        }
        const existingFollow = await this.findByIdFollow(fromUser);
        if (existingFollow) {
            throw new ConflictRequestError('You are already following this user');
        }
        const newFollow = this.followModel.create({
            followerId: fromUser,
            followingId: targetUserId,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        return newFollow;
    }


    async unfollow(userId: string, Id: string): Promise<FollowRelation | null> {
        const follow = await this.followModel.findOneAndDelete({
            followerId: userId,
            followingId: Id
        });
        if (!follow) {
            throw new NotFoundError('You are not following this user');
        }
        return follow;
    }

    async handleFollowAction(fromUser: string, targetUserId: string, action: 'addfollow' | 'unfollow') {
        switch (action) {
            case 'addfollow':
                await this.createFollow(fromUser, targetUserId);
                return { message: 'Followed successfully' };

            case 'unfollow':
                await this.unfollow(fromUser, targetUserId);
                return { message: 'Unfollowed successfully' };
            default:
                throw new BadRequestException('Invalid action');
        }
    }
    async getHandleFollow(fromUser: string) {
        const follows = await this.followModel.find({
            followerId: fromUser,
        }).lean();

        if (!follows || follows.length === 0) {
            throw new NotFoundError('You are not following any users');
        }

        const followingIds = follows.map(f => f.followingId.toString());

        const listFollowing = await this.userService.findByIds(followingIds);

        return {
            message: 'Follow status retrieved successfully',
            follow: listFollowing,
        };
    }

}
