import { BadRequestException, Injectable } from "@nestjs/common";
import { Feel, FeelDocument, } from "./feels.model";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFeelAdminDto, CreateFeelDto } from "./create-feel.dto";


@Injectable()
export class FeelService {
    constructor(
        @InjectModel(Feel.name, 'MONGODB_CONNECTION')
        private feelModel: Model<FeelDocument>
    ) { }

    async createFeelAdmin(createFeelAdminDto: CreateFeelAdminDto) {
        return await this.feelModel.create({
            ...createFeelAdminDto,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }




    // Tạo mới feel nếu chưa tồn tại
    async createFeel(createFeelDto: Partial<Feel>) {
        const existing = await this.feelModel.findOne({
            post_id: createFeelDto.post_id,
            user_id: createFeelDto.user_id,
        });

        if (existing) {
            throw new BadRequestException('Feel already exists');
        }

        return await this.feelModel.create({
            ...createFeelDto,
            feel_type: 'reaction',
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    // Like hoặc update cảm xúc
    async likePost(postId: string, userId: string, feelId: string, feel_name: string) {
        const existing = await this.feelModel.findOne({
            post_id: postId,
            user_id: userId,
        });

        if (existing) {
            if (existing.feel_id === feelId && existing.feel_name === feel_name) {
                return { message: 'Feel already exists' };
            }

            existing.feel_id = feelId;
            existing.feel_name = feel_name;
            await existing.save();
        } else {
            await this.feelModel.create({
                post_id: postId,
                user_id: userId,
                feel_id: feelId,
                feel_name,
                feel_type: 'reaction',
            });
        }

        return { message: 'Feel updated successfully' };
    }

    // Bỏ like
    async unlikePost(postId: string, userId: string) {
        await this.feelModel.deleteOne({
            post_id: postId,
            user_id: userId,
            feel_type: 'reaction',
        });
    }

    // Toggle cảm xúc like/love/haha
    async handleFeel(postId: string, userId: string, feel_name?: 'like' | 'love' | 'haha') {
        const current = await this.feelModel.findOne({
            post_id: postId,
            user_id: userId,
            feel_type: 'reaction',
        });

        // Nếu đã tồn tại và muốn gỡ bỏ hoặc giữ nguyên
        if (!feel_name || (current && current.feel_name === feel_name)) {
            if (current) {
                await this.feelModel.deleteOne({ _id: current._id });
            }
        } else {
            if (current) {
                current.feel_name = feel_name;
                await current.save();
            } else {
                await this.feelModel.create({
                    post_id: postId,
                    user_id: userId,
                    feel_type: 'reaction',
                    feel_name,
                });
            }
        }

        // Thống kê tổng hợp cảm xúc
        const stats = await this.feelModel.aggregate([
            {
                $match: {
                    post_id: new Types.ObjectId(postId),
                    feel_type: 'reaction',
                },
            },
            {
                $group: {
                    _id: '$feel_name',
                    count: { $sum: 1 },
                },
            },
        ]);

        return {
            message: 'Feel updated successfully',
            userFeel: feel_name || null,
            feelCounts: Object.fromEntries(stats.map(s => [s._id, s.count])),
        };
    }
}









