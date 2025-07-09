import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendRelation, FriendRelationDocument } from './friend.model';
import { FORBIDDEN, NotFoundError } from '../../utils/error.response';
import { getInfoData } from '../../utils/index';
import { logger } from '../../utils/logger';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
@Injectable()
export class FriendService {
    constructor(
        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private friendRelationModel: Model<FriendRelationDocument>,
    ) { }

    // Gửi lời mời kết bạn
    async sendRequest(fromUser: string, toUser: string) {
        if (fromUser === toUser) {
            throw new BadRequestException('Cannot send request to yourself');
        }

        const existing = await this.friendRelationModel.findOne({
            fromUser,
            toUser,
            status: 'pending',
        });

        if (existing) {
            throw new BadRequestException('Friend request already sent');
        }

        return this.friendRelationModel.create({ fromUser, toUser });
    }

    // Từ chối lời mời
    async rejectRequest(requestId: string) {
        const request = await this.friendRelationModel.findById(requestId);
        if (!request || request.status !== 'pending') {
            throw new NotFoundException('Request not found');
        }

        request.status = 'rejected';
        await request.save();
        return request;
    }

    // Chấp nhận lời mời
    async acceptRequest(id: string, toUserId: string) {
        const request = await this.friendRelationModel.findById(id);
        logger.info(`Accepting requestId: ${id}`);
        logger.info(`Request details: ${JSON.stringify(request)}`);

        if (!request || request.status !== 'pending') {
            throw new NotFoundError('The friend request does not exist or has been processed.');
        }

        if (request.toUser.toString() !== toUserId.toString()) {
            throw new FORBIDDEN('You do not have permission to accept this request');
        }

        request.status = 'accepted';
        request.acceptedAt = new Date();
        await request.save();

        return request;
    }
      

    // Lấy danh sách lời mời đến chưa xác nhận
    async getPendingRequests(toUserId: string) {
        return this.friendRelationModel
            .find({ toUser: toUserId, status: 'pending' })
            .populate('fromUser', 'name avatar email');
    }

    // Lấy danh sách bạn bè (đã accepted)
    async getFriends(userId: string) {
        const relations = await this.friendRelationModel.find({
            status: 'accepted',
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        })
            .populate('fromUser', 'name avatar') 
            .populate('toUser', 'name avatar ')   
            .lean();

        return relations.map((relation) => {
            const from = relation.fromUser as any;
            const to = relation.toUser as any;

            const isFromCurrentUser = String(from._id) === String(userId);
            const friend = isFromCurrentUser ? to : from;

            return {
                _id: friend._id,
                name: friend.name,
                avatar: friend.avatar,
                followers: friend.followers,
            };
        });
    }
    
}

