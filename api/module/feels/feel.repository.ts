// feel.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Feel, FeelDocument } from './feels.model';
import { Model, Types } from 'mongoose';


@Injectable()
export class FeelRepository {
    constructor(
        @InjectModel(Feel.name)
        private readonly feelModel: Model<FeelDocument>,
    ) { }

    async findByUserAndPost(userId: Types.ObjectId, postId: Types.ObjectId) {
        return this.feelModel.findOne({ user_id: userId, post_id: postId });
    }

    async createFeel(data: Partial<Feel>) {
        return this.feelModel.create(data);
    }

    async updateFeel(feelId: Types.ObjectId, update: Partial<Feel>) {
        return this.feelModel.findByIdAndUpdate(feelId, update, { new: true });
    }

    async deleteFeelById(feelId: Types.ObjectId) {
        return this.feelModel.findByIdAndDelete(feelId);
    }

    async countFeelByPost(postId: Types.ObjectId) {
        return this.feelModel.aggregate([
            { $match: { post_id: postId } },
            {
                $group: {
                    _id: '$feel_name',
                    count: { $sum: 1 },
                },
            },
        ]);
    }
}
