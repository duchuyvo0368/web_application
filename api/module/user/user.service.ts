import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.model';
import { convertToObject, getInfoData } from '../../utils/index';
import * as bcrypt from 'bcrypt';
import { AuthFailureError, BadRequestError } from '../../utils/error.response';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { logger } from '../../utils/logger';
import { UserDto } from './dto/user.dto';
import { FriendService } from '../firends/friends.service';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, 'MONGODB_CONNECTION') private readonly userModel: Model<UserDocument>,
        private readonly friendService: FriendService,
    ) { }

    findByEmail = async ({ email, select = {
        email: 1,
        password: 1,
        name: 1,
        bio: 1,
        avatar: 1
    } }: { email: string; select?: any } = { email: '', select: {} }): Promise<any | null> => {
        const user = await this.userModel.findOne({ email }).select(select).lean();
        return user;
    };

    getUserById = async (userId: string): Promise<any | null> => {
        return this.userModel.findById(userId).lean();
    };

    createUser = async (body: UserDto) => {
        const { name, email, password, avatar, bio } = body;

        if (!name || !email || !password || !avatar) {
            throw new BadRequestError('Missing required fields');
        }

        const existingUser = await this.findByEmail({ email });
        if (existingUser) {
            throw new BadRequestError('Error: User already exists!');
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await this.userModel.create({
            name,
            email,
            password: passwordHash,
            avatar,
            bio,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        if (newUser) {
            return {
                data: {
                    shop: getInfoData({
                        fields: ['_id', 'name', 'email'],
                        objects: newUser,
                    }),
                },
            };
        }

        return {
            code: '200',
            metadata: null,
        };
    };


    updateUser = async (id: string, userData: UserDto): Promise<any | null> => {
        return this.userModel.findByIdAndUpdate(
            id,
            { ...userData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).lean();
    };

    deleteUser = async (id: string): Promise<boolean> => {
        const result = await this.userModel.findByIdAndDelete(id);
        return !!result;
    };

    async getAllUsers(userId: string, limit: string): Promise<UserDocument[]> {
        const relatedUserIds = await this.friendService.getRelatedUserIds(userId);
        relatedUserIds.push(userId);

        return this.userModel
            .find({ _id: { $nin: relatedUserIds } })
            .limit(Number(limit))
            .lean();
    }


    async updateFollowersCount(toUserId: string, increment: boolean): Promise<User | null> {
        const update = increment
            ? { $inc: { followersCount: 1 } }
            : { $inc: { followersCount: -1 } };

        return this.userModel.findByIdAndUpdate(toUserId, update, { new: true });
    }

    async updateFollowingCount(userId: string, increment: boolean): Promise<User | null> {
        const update = increment
            ? { $inc: { followingCount: 1 } }
            : { $inc: { followingCount: -1 } };

        return this.userModel.findByIdAndUpdate(userId, update, { new: true });
    }


}
