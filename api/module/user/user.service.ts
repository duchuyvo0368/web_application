import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';
import { convertToObject, getInfoData } from '../../utils/index';
import * as bcrypt from 'bcrypt';
import { AuthFailureError, BadRequestError } from '../../utils/error.response';
import mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { logger } from '../../utils/logger';
import { UserDto } from './dto/user.dto';
import { FriendService } from '../firends/friends.service';
import { filterFields } from '../../utils/index';

const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];

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

    findUserById = async (userId: string): Promise<any | null> => {
        return this.userModel.findById(userId).lean();
    };
    async findByIds(ids: string[]) {
        return this.userModel.find({ _id: { $in: ids } }).select('_id name avatar').lean();
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




    // async updateFollowersCount(toUserId: string, increment: boolean): Promise<User | null> {
    //     const update = increment
    //         ? { $inc: { followersCount: 1 } }
    //         : { $inc: { followersCount: -1 } };

    //     return this.userModel.findByIdAndUpdate(toUserId, update, { new: true });
    // }

    // async updateFollowingCount(userId: string, increment: boolean): Promise<User | null> {
    //     const update = increment
    //         ? { $inc: { followingCount: 1 } }
    //         : { $inc: { followingCount: -1 } };

    //     return this.userModel.findByIdAndUpdate(userId, update, { new: true });
    // }













    async getProfile(
        userId: string,
        id: string,
    ): Promise<{
        user: Partial<User>;
        relation: 'me' | 'accepted' | 'pending' | 'stranger';
        isFollowing: boolean
    }> {
        const user = await this.userModel.findById(id).lean();
        if (!user) throw new NotFoundException('User not found');


        let relation: 'me' | 'accepted' | 'pending' | 'stranger' = 'stranger';

        if (userId === id) {
            relation = 'me';
        } else {
            const friendRecord = await this.friendService.getFriendById(userId, id);
            if (friendRecord) {
                if (friendRecord.type === 'accepted') relation = 'accepted';
                else if (friendRecord.type === 'pending') relation = 'pending';
            }
        }

        // 3. Kiểm tra xem userId có đang follow friendId không
        //const isFollowing = await this.friendService.isFollowing(userId, friendId);

        const { password, email, ...filteredUser } = user;
         const followIds = await this.friendService.getFollowingUserIds(userId);
        const isFollowing = followIds.includes(id);

        return {
            user: filteredUser,
            relation,
           isFollowing
        };
    }






    async updateAvatar(userId: string, avatarUrl: string): Promise<any> {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true },
        );

        if (!user) {
            throw new Error('User not found');
        }

        return {
            status: 'success',
            message: 'Avatar updated successfully',
            metadata: user,
        };
    }





    async getAllUsers(userId: string, limit: number, page: number) {
        const skip = (page - 1) * limit;

        const objectIdList: Types.ObjectId[] = (await this.friendService.getRelatedUserIds(userId))
            .map(id => new Types.ObjectId(id));
        const aggResult = await this.userModel.aggregate([
            { $match: { _id: { $nin: objectIdList } } },
            {
                $facet: {
                    data: [
                        { $sample: { size: limit * page } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0 } }
                    ],
                    total: [
                        { $count: 'count' }
                    ]
                }
            },
        ]);

        const users = aggResult[0]?.data || [];
        const totalItems = aggResult[0]?.total[0]?.count || 0;
        const totalPages = Math.ceil((totalItems || 1) / limit);

        // Lấy danh sách đang follow để đánh dấu isFollowing
        const followingRelations = await this.friendService.getFollowingRelations(userId, limit * page);
        const followedIds = new Set(followingRelations.map(rel => rel.toUser.toString()));

        // Tính follower/following cho từng user
        const usersList = await Promise.all(
            users.map(async (userItem: any) => {
                const friendId = userItem._id?.toString();
                if (!friendId) return null; // Bỏ qua nếu không có _id

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
            })
        );

        // Lọc bỏ các user null (nếu có)
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


}





