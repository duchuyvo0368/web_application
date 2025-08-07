import { BadRequestException, Injectable } from "@nestjs/common";
import { Feel, FeelDocument, } from "./feels.model";
import { Model, Types } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";
import { CreateFeelAdminDto, CreateFeelDto } from "./create-feel.dto";
import { FeelRepository } from "./feel.repository";



export class FeelService {
    constructor(private readonly feelRepo: FeelRepository) { }

    async toggleFeel(
        userId: string,
        postId: string,
        feelName: Feel['feel_name'] = 'like',
    ) {
        const userObjectId = new Types.ObjectId(userId);
        const postObjectId = new Types.ObjectId(postId);

        const existing = await this.feelRepo.findByUserAndPost(userObjectId, postObjectId);

        if (existing) {
            // Nếu đã like cùng loại cảm xúc → unlike
            if (existing.feel_name === feelName) {
                await this.feelRepo.deleteFeelById(existing.id);
            } else {
                // Nếu đã like khác loại cảm xúc → cập nhật
                await this.feelRepo.updateFeel(existing.id, { feel_name: feelName });
            }
        } else {
            // Nếu chưa có → tạo mới
            await this.feelRepo.createFeel({
                user_id: userObjectId,
                post_id: postObjectId,
                feel_name: feelName,
            });
        }

        // Đếm lại cảm xúc
        const counts = await this.feelRepo.countFeelByPost(postObjectId);
        return this.formatCountResult(counts);
    }

    private formatCountResult(rawCounts: { _id: string; count: number }[]) {
        const result: Record<string, number> = {};
        rawCounts.forEach((item) => {
            result[item._id] = item.count;
        });
        return result;
    }
}