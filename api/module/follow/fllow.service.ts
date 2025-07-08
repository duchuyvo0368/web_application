import { BadRequestError } from '../../utils/error.response';
import { Follow, FollowDocument } from './follow.model';
import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel(Follow.name) private followModel: Model<FollowDocument>,
    ) { }

    async follow(follower: string, following: string) {
        if (follower === following)
            throw new BadRequestError('Cannot follow yourself');
        const exists = await this.followModel.findOne({ follower, following });
        if (exists) throw new BadRequestError('Already following');

        return this.followModel.create({ follower, following });
    }

    async unfollow(follower: string, following: string) {
        return this.followModel.deleteOne({ follower, following });
    }

    async countFollowers(userId: string) {
        return this.followModel.countDocuments({ following: userId });
    }

    async countFollowing(userId: string) {
        return this.followModel.countDocuments({ follower: userId });
    }
}
