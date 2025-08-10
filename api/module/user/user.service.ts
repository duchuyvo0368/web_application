import { Type } from 'class-transformer';
import { Injectable, Inject, NotFoundException, UseGuards, Post, BadRequestException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { convertToObject, getInfoData } from '../../utils/index';
import * as bcrypt from 'bcrypt';
import { AuthFailureError, BadRequestError } from '../../utils/error.response';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { logger } from '../../utils/logger';
import { UserDto } from './user.dto';
import { FriendService } from '../firends/friends.service';
import { filterFields } from '../../utils/index';

import { UploadService } from 'module/upload/upload.service';
import { MulterS3File } from 'module/upload/utils/multe.s3.file';
import { SuccessResponse } from 'utils/success.response';
import { FriendRelation, FriendRelationDocument } from 'module/firends/friend.model';

const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name, 'MONGODB_CONNECTION')
        private readonly userModel: Model<UserDocument>,
        private readonly friendService: FriendService,
        private readonly uploadService: UploadService,
        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private readonly friendRelationModel: Model<FriendRelationDocument>,
    ) { }

    findByEmail = async (
        {
            email,
            select = {
                email: 1,
                password: 1,
                name: 1,
                bio: 1,
                avatar: 1,
            },
        }: { email: string; select?: any } = { email: '', select: {} },
    ): Promise<any | null> => {
        const user = await this.userModel.findOne({ email }).select(select).lean();
        return user;
    };

    findUserById = async (userId: string): Promise<any | null> => {
        return this.userModel.findById(userId).lean();
    };
    async findByIds(ids: string[]) {
        return this.userModel
            .find({ _id: { $in: ids } })
            .select('_id name avatar')
            .lean();
    }

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
        return this.userModel
            .findByIdAndUpdate(
                id,
                { ...userData, updatedAt: new Date() },
                { new: true, runValidators: true },
            )
            .lean();
    };

    deleteUser = async (id: string): Promise<boolean> => {
        const result = await this.userModel.findByIdAndDelete(id);
        return !!result;
    };



    async getProfile(
        userId: string,
        id: string,
    ): Promise<{
        user: Partial<User>;
        countFriends: number,
        followersCount: number;
        followingCount: number;
        relation: 'me' | 'accepted' | 'pending_sent' | 'pending_received' | 'stranger';
        isFollowing: boolean;
    }> {
        const user = await this.userModel.findById(id).lean();
        if (!user) throw new NotFoundException('User not found');

        // Xác định quan hệ
        const relation = userId === id
            ? 'me'
            : await (async () => {
                const friend = await this.friendService.findAnyRelationBetweenUsers(userId, id);
                if (!friend) return 'stranger';
                if (friend.type === 'accepted') return 'accepted';
                if (friend.type === 'pending') {
                    return friend.fromUser.toString() === userId ? 'pending_sent' : 'pending_received';
                }
                return 'stranger';
            })();

        const isFollowing = await this.friendService.isFollowing(userId, id);
        const countFriends = await this.friendService.countFriends(id)
        const [followersCount, followingCount] = await Promise.all([
            this.friendService.countFollowers(id),
            this.friendService.countFollowing(id),
        ]);

        const { password, email, ...filteredUser } = user;

        return {
            user: filteredUser,
            relation,
            countFriends,
            followersCount,
            followingCount,
            isFollowing,
        };
    }


    async updateAvatar(userId: string, type: string, file: Express.Multer.File) {
        const result = await this.uploadService.handleUpload(file, type);

        // Lấy đúng `url` từ metadata
        const avatarUrl = result?.metadata?.url;

        if (!avatarUrl) {
            throw new Error('Không lấy được URL ảnh từ kết quả upload');
        }

        await this.userModel.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl }, // ✅ avatar giờ là string, không còn lỗi
            { new: true }
        );

        return new SuccessResponse({
            message: 'Avatar upload successfully',
            metadata: avatarUrl,
        });
    }


    async getAllUsers(userId: string, limit: number, page: number) {
        const skip = (page - 1) * limit;

        const objectIdList = await this.friendService.getRelatedUserIds(userId)


        const excludedObjectIds = objectIdList.map(id => new Types.ObjectId(id));
        logger.info(`Excluded object IDs: ${JSON.stringify(excludedObjectIds)}`);
        const aggResult = await this.userModel.aggregate([
            { $match: { _id: { $nin: excludedObjectIds } } },
            {
                $facet: {
                    data: [
                        { $sample: { size: limit * page } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0 } },
                    ],
                    total: [{ $count: 'count' }],
                },
            },
        ]);

        const users = aggResult[0]?.data || [];
        const totalItems = aggResult[0]?.total[0]?.count || 0;
        const totalPages = Math.ceil((totalItems || 1) / limit);

        // Lấy danh sách đang follow để đánh dấu isFollowing
        const followingRelations = await this.friendService.getFollowingRelations(
            userId,
            limit * page,
        );
        // Đảm bảo toUser luôn là string
        const followedIds = new Set(
            followingRelations.map((rel) => {
                if (typeof rel.toUser === 'string') return rel.toUser;
                if (rel.toUser?._id) return rel.toUser._id.toString();
                if (rel.toUser?.toString) return rel.toUser.toString();
                return '';
            }).filter(id => id)
        );

        // Trong map user
        const usersList = await Promise.all(
            users.map(async (userItem: any) => {
                const friendId = userItem._id?.toString();
                if (!friendId) return null;

                const [followersCount, followingCount] = await Promise.all([
                    this.friendService.countFollowers(friendId),
                    this.friendService.countFollowing(friendId),
                ]);

                return {
                    ...userItem,
                    isFollowing: followedIds.has(friendId),
                    followersCount,
                    followingCount,
                };
            }),
        );

       
        const filteredUsers = usersList.filter(Boolean);

        return {
            data: filteredUsers,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages,
            },
        };
    }

    async searchUsers(userId: string, query: string, limit = 10, page = 1) {
        if (!Types.ObjectId.isValid(userId)) {
            throw new BadRequestException('Invalid userId');
        }

        const relations = await this.friendRelationModel
            .find({
                type: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .limit(limit)
            .lean();

        const friends = relations.map(rel => {
            const from = rel.fromUser as any;
            const to = rel.toUser as any;
            if (!from || !to) return null;

            return from._id.toString() === userId ? to : from;
        }).filter(Boolean);

        const lowerQuery = query.toLowerCase();
        const filtered = friends.filter(user => {
            const text = `${user.name} ${user.avatar} ${user.email}`.toLowerCase();
            return text.includes(lowerQuery);
        });

        return filtered.slice(0, 10);
    }






}
