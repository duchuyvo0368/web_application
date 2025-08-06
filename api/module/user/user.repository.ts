// user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from './user.model';

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name, 'MONGODB_CONNECTION')
        private readonly userModel: Model<UserDocument>,
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
        return this.userModel.findOne({ email }).select(select).lean();
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

    async createUser(data: any): Promise<any> {
        return this.userModel.create(data);
    }

    async updateUser(id: string, userData: any): Promise<any | null> {
        return this.userModel
            .findByIdAndUpdate(
                id,
                { ...userData, updatedAt: new Date() },
                { new: true, runValidators: true },
            )
            .lean();
    }

    async deleteUser(id: string): Promise<boolean> {
        const result = await this.userModel.findByIdAndDelete(id);
        return !!result;
    }

    async updateAvatar(id: string, avatarUrl: string): Promise<any> {
        return this.userModel.findByIdAndUpdate(id, { avatar: avatarUrl }, { new: true });
    }

    async getUserAggregateExcludingIds(
        excludedIds: Types.ObjectId[],
        limit: number,
        skip: number,
    ): Promise<any> {
        return this.userModel.aggregate([
            { $match: { _id: { $nin: excludedIds } } },
            {
                $facet: {
                    data: [
                        { $sample: { size: limit * (skip / limit + 1) } },
                        { $skip: skip },
                        { $limit: limit },
                        { $project: { password: 0 } },
                    ],
                    total: [{ $count: 'count' }],
                },
            },
        ]);
    }

    async searchByNameInIds(
        ids: string[],
        regex: RegExp,
        limit: number,
        skip: number,
    ): Promise<any[]> {
        return this.userModel
            .find({
                _id: { $in: ids },
                name: regex,
            })
            .select('name email avatar')
            .skip(skip)
            .limit(limit)
            .lean();
    }
}
