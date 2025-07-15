
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendRelation, FriendRelationDocument } from './entities/friend.model';
import { BadRequestError, FORBIDDEN, NotFoundError } from '../../utils/error.response';
import { convertToObject, getInfoData } from '../../utils/index';
import { logger } from '../../utils/logger';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { filter } from 'lodash';
@Injectable()
export class FriendService {
    constructor(
        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private friendRelationModel: Model<FriendRelationDocument>,
    ) { }

    // Từ chối lời mời
    async rejectRequest(fromUser: string, toUser: string) {
        const request = await this.friendRelationModel.findOne({
            fromUser: toUser,
            toUser: fromUser,
            status: 'pending',
        });

        if (!request) {
            throw new NotFoundException('Friend request not found or already processed');
        }

        if (request.toUser.toString() !== toUser.toString()) {
            throw new FORBIDDEN('You are not authorized to reject this request');
        }

        request.status = 'rejected';
        await request.save();

        return request;
    }



    // Chấp nhận lời mời
    async acceptRequest(fromUser: string, toUser: string) {
        const request = await this.friendRelationModel.findOne({
            fromUser: toUser,
            toUser: fromUser,
            status: 'pending',
        });

        logger.info(`Accepting friend request from fromUser:${fromUser} to toUser: ${toUser} and request: ${JSON.stringify(request)}`);
        if (!request) {
            throw new BadRequestError('The friend request does not exist or has been processed.' +request);
        }

        request.status = 'accepted';
        request.acceptedAt = new Date();
        await request.save();

        logger.info(`Friend request from ${fromUser} accepted by user ${toUser}`);

        return request;
    }



    // Lấy danh sách lời mời đến chưa xác nhận
    async getPending(userId: string, limit: number) {
        return this.friendRelationModel
            .find({ toUser: userId, status: 'pending' })
            .populate('fromUser', 'name avatar email').limit(limit).lean();
    }

    // Lấy danh sách lời mời đã gửi
    async getSentFriendRequest(userId: string, limit: number) {
        return this.friendRelationModel
            .find({ fromUser: userId, status: 'pending' })
            .populate('toUser', 'name avatar email').limit(limit).lean();
    }
    // Lấy danh sách bạn bè (đã accepted)
    async getFriends(userId: string, limit: number) {
        const relations = await this.friendRelationModel.find({
            status: 'accepted',
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        })
            .populate('fromUser', 'name avatar')
            .populate('toUser', 'name avatar ').limit(limit)
            .lean();
        logger.info(`Fetching friends for userId: ${relations}`);
        return relations.map((relation) => {
            const from = relation.fromUser as any;
            const to = relation.toUser as any;

            const isFromCurrentUser = String(from._id) === String(userId);
            const friend = isFromCurrentUser ? to : from;
            logger.info(`Friend details: ${JSON.stringify(friend)}`);
            return {
                _id: relation._id,
                userId: friend._id,
                name: friend.name,
                avatar: friend.avatar,
                followers: friend.followers,
            };
        });
    }

    // Gửi lời mời kết bạn
    async friendRequest(fromUser: string, toUser: string) {
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

    // Hủy lời mời kết bạn
    async cancelFriendRequest(fromUser: string, toUser: string) {
        const cancelRequest = await this.friendRelationModel.findOneAndDelete({
            toUser: toUser,
            fromUser: fromUser,
            status: 'pending'
        });
        if (!cancelRequest) {
            throw new NotFoundError('Friend request not found or not authorized to cancel');
        }
        logger.info(`Friend request ${toUser} cancelled by user ${fromUser}`);
        return cancelRequest
    }

    async getRelatedUserIds(userId: string): Promise<string[]> {
        const relations = await this.friendRelationModel.find({
            $or: [
                { fromUser: userId, status: { $in: ['accepted', 'pending'] } },
                { toUser: userId, status: { $in: ['accepted', 'pending'] } },
            ],
        }).lean();

        const relatedIds = new Set<string>();

        for (const rel of relations) {
            const otherId = rel.fromUser.toString() === userId
                ? rel.toUser.toString()
                : rel.fromUser.toString();

            relatedIds.add(otherId);
        }

        return Array.from(relatedIds);
    }

    // Hủy kết bạn
    async unFriend(userId: string) {
        const unFriend = await this.friendRelationModel.findOneAndDelete({
            status: 'accepted',
            $or: [
                { fromUser: userId },
                { toUser: userId }
            ]
        });
        if (!unFriend) {
            throw new NotFoundError('Friend request not found or not authorized to cancel');
        }
        logger.info(`Friend request ${userId} unfriend by user ${userId}`);
        return unFriend
    }
    // Xử lý hành động gửi hoặc hủy lời mời kết bạn
    async handleFriendRequestAction(
        fromUser: string,
        toUser: string,
        action: 'send' | 'cancel' | 'accept' | 'reject'
    ) {
        switch (action) {
            case 'send':
                await this.friendRequest(fromUser, toUser);
                return { message: 'Friend request sent successfully' };

            case 'cancel':
                await this.cancelFriendRequest(fromUser, toUser);
                return { message: 'Friend request cancelled successfully' };
            case 'accept':
                await this.acceptRequest(fromUser, toUser);
                return { message: 'Friend request accepted successfully' };
            case 'reject':
                await this.rejectRequest(fromUser, toUser);
                return { message: 'Friend request rejected successfully' };
            default:
                throw new BadRequestException(`Unsupported action: ${action}`);
        }


    }


    async getFriendListByType(
        userId: string,
        type: 'all' | 'sent' | 'pending' | 'deleted',
        limit: number
    ) {
        switch (type) {
            case 'all':
                return this.getFriends(userId, limit);
            case 'sent':
                return this.getSentFriendRequest(userId, limit);
            case 'pending':
                return this.getPending(userId, limit);
            case 'deleted':
                return this.unFriend(userId);
            default:
                throw new BadRequestException('Invalid type');
        }
    }




}

