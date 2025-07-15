import { InjectModel } from '@nestjs/mongoose';
import { Follow, FollowRelation } from './entities/follow.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { Model } from 'mongoose';
import { find } from 'lodash';
import { BadRequestError, ConflictRequestError, NotFoundError } from 'utils/error.response';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follow.name, 'MONGODB_CONNECTION')
        private readonly followModel: Model<FollowRelation>
    ) { }
    async findByIdFollow(id: string): Promise<FollowRelation | null> {
        return this.followModel.findById({
            id: id,
            $or: [
                { followerId: id },
                { followingId: id }
            ]
        }).lean();
    }
    async createFollow(userId: string, followerId: string): Promise<any> {
        if (userId === followerId) {
            throw new BadRequestError('Cannot follow yourself');
        }
        const existingFollow = await this.findByIdFollow(userId);
        if (existingFollow) {
            throw new ConflictRequestError('You are already following this user');
        }
        const newFollow =this.followModel.create({
            followerId: userId,
            followingId: followerId,
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

    async handleFollowAction(userId: string, targetUserId: string, action: 'follow' | 'unfollow'): Promise<string> {
        switch (action) {
            case 'follow':
                await this.createFollow(userId, targetUserId);
                return 'Followed successfully';
            case 'unfollow':
                await this.unfollow(userId, targetUserId);
                return 'Unfollowed successfully';
            default:
                throw new BadRequestException('Invalid action');
        }
    }

}
