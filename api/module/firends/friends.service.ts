import { SuccessResponse } from './../../utils/success.response';

import { Injectable, BadRequestException, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FriendRelation, FriendRelationDocument } from './entities/friend.model';
import { BadRequestError, FORBIDDEN, NotFoundError } from '../../utils/error.response';
import { convertToObject, getInfoData } from '../../utils/index';
import { logger } from '../../utils/logger';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { filter } from 'lodash';
import { from } from 'rxjs';
@Injectable()
export class FriendService {
    constructor(
        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private friendRelationModel: Model<FriendRelationDocument>,
    ) { }



    // Xử lý gửi lời mời kết bạn
    async friendRequest(fromUser: string, toUser: string) {
        if (fromUser === toUser) {
            throw new BadRequestException('Cannot send request to yourself');
        }

        const existing = await this.friendRelationModel.findOne({ fromUser, toUser });

        if (existing) {
            if (existing.status === 'pending' || existing.status === 'accepted') {
                throw new BadRequestException('Friend request already sent or already friends');
            }

            // Cập nhật lại trạng thái thành pending
            await this.friendRelationModel.updateOne(
                { _id: existing._id },
                {
                    $set: {
                        status: 'pending',
                    },
                }
            );

            return {
                message: 'Friend request sent (existing relation updated)',
                data: {
                    fromUser,
                    toUser,
                    status: 'pending',
                },
            };
        }

        const created = await this.friendRelationModel.create({
            fromUser,
            toUser,
            status: 'pending',
        });

        return {
            message: 'Friend request sent (new relation created)',
            data: created,
        };
    }



    // Xử lý chấp nhận lời mời kết bạn
    async acceptRequest(fromUser: string, toUser: string) {
        const request = await this.friendRelationModel.findOne({
            fromUser: toUser,
            toUser: fromUser,
            status: 'pending',
        });
        logger.info(`fromUser:${fromUser} +toUser:${toUser}`)
        logger.info(`requets:${request}`)
        if (!request) {
            throw new BadRequestException('Friend request not found');
        }

        if (request.status !== 'pending') {
            throw new BadRequestException('Cannot accept non-pending request');
        }

        // Chỉ người nhận (toUser) mới được chấp nhận lời mời
        if (fromUser !== request.toUser.toString()) {
            throw new ForbiddenException('Not authorized to accept this request');
        }

        // Cập nhật status và acceptedAt
        await this.friendRelationModel.updateOne(
            { _id: request._id },
            {
                $set: {
                    status: 'accepted',
                    acceptedAt: new Date(),
                },
            }
        );

        return {
            message: 'Friend request accepted',
            data: {
                fromUser,
                toUser,
                status: 'accepted',
            },
        };
    }

    // Xử lý từ chối lời mời kết bạn
    async rejectRequest(fromUser: string, toUser: string) {
        const request = await this.friendRelationModel.findOne({
            fromUser,
            toUser,
            status: 'pending',
        });

        if (!request) {
            throw new NotFoundException('Friend request not found or already processed');
        }

        // Kiểm tra quyền từ chối
        if (toUser !== request.toUser.toString()) {
            throw new ForbiddenException('Not authorized to reject this request');
        }

        // Cập nhật trạng thái thành 'rejected'
        await this.friendRelationModel.updateOne(
            { _id: request._id },
            { $set: { status: 'rejected' } }
        );

        return {
            message: 'Friend request rejected',
            data: { fromUser, toUser, status: 'rejected' },
        };
    }


    // delete một lời mời kết bạn
    async deleteFriendRequest(fromUser: string, toUser: string) {
        const request = await this.friendRelationModel.findOne({
            fromUser,
            toUser,
        });

        if (!request) {
            throw new NotFoundException('Friend request not found');
        }

        // Chỉ được huỷ nếu chưa được xử lý
        if (request.status !== 'pending' && request.status !== null) {
            throw new BadRequestException('Cannot cancel a processed friend request');
        }

        if (request.isFollowing === 'unfollow') {
            // Nếu không follow và không còn request => xoá bản ghi luôn
            await this.friendRelationModel.deleteOne({ _id: request._id });
            return { message: 'Friend request deleted (no follow)' };
        }

        // Nếu vẫn đang follow thì chỉ xoá trạng thái request
        await this.friendRelationModel.updateOne(
            { _id: request._id },
            { $set: { status: null, acceptedAt: null } }
        );

        return { message: 'Friend request cancelled (status cleared)' };
    }



    // Theo dõi (follow)
    async follow(fromUser: string, toUser: string) {
        if (fromUser === toUser) {
            throw new BadRequestException('Cannot follow yourself');
        }

        const existing = await this.friendRelationModel.findOne({ fromUser, toUser });
        const followStatus = existing?.isFollowing;
        logger.info(`[DEBUG] isFollowing raw value: '${followStatus}'`);
        logger.info(`[DEBUG] typeof: ${typeof followStatus}`);
        logger.info(`[DEBUG] Object.prototype.toString: ${Object.prototype.toString.call(followStatus)}`);

        if (existing?.isFollowing?.toString().trim().toLowerCase() === 'follow') {
            throw new ConflictException('You are already following this person 1'); // ✅ Đúng logic
        }

        logger.info(`existing: ${existing}`)
        if (!existing) {
            await this.friendRelationModel.create({
                fromUser,
                toUser,
                isFollowing: 'follow',
                status: null,
            });

            return { message: 'Followed success (new relation created)' };
        }



        // Nếu đã có nhưng đang unfollow => cập nhật lại isFollowing
        await this.friendRelationModel.updateOne(
            { fromUser, toUser },
            { $set: { isFollowing: 'follow' } }
        );

        return { message: 'Followed success' };
    }

    // Hủy theo dõi (unfollow)
    // Nếu chỉ follow mà chưa gửi kết bạn thì xóa luôn
    async unfollow(fromUser: string, toUser: string) {
        logger.info(`data unfollow: ${fromUser} +${toUser}`)
        const relation = await this.friendRelationModel.findOne({ fromUser, toUser });
        logger.info(`data unfollow ${relation}`)
        if (!relation || relation.isFollowing.toString() === 'unfollow') {
            throw new BadRequestException('You are not following this person2');
        }

        if (relation.status === null) {
            // Nếu chỉ follow mà chưa gửi kết bạn -> xóa luôn
            await this.friendRelationModel.deleteOne({ _id: relation._id });
            return { message: 'Unfollowed and relation deleted (no friend request)' };
        }

        // Nếu đã từng gửi lời mời thì chỉ cập nhật lại trạng thái follow
        await this.friendRelationModel.updateOne(
            { _id: relation._id },
            { $set: { isFollowing: 'unfollow' } }
        );

        return { message: 'Unfollowed successfully' };
    }


    // Lấy danh sách lời mời đến chưa xác nhận
    async getPendingFriendRequests(userId: string, limit: number) {
        const pendingRequests = await this.friendRelationModel
            .find({ toUser: userId, status: 'pending' })
            .populate('fromUser', 'name avatar email')
            .limit(limit)
            .lean();

        const result = await Promise.all(
            pendingRequests.map(async (request) => {
                const requester = request.fromUser;
                const requesterId = requester._id.toString();
                const followingCount = await this.countFollowing(requesterId);

                return {
                    ...request,
                    fromUser: {
                        ...requester,
                        followingCount,
                    },
                };
            })
        );

        return result;
    }


    // Lấy danh sách lời mời đã gửi
    async getSentFriendRequest(userId: string, limit: number) {
        const pendingFriends = await this.friendRelationModel
            .find({ fromUser: userId, status: 'pending' })
            .populate('toUser', 'name avatar email')
            .limit(limit)
            .lean();


        const result = await Promise.all(
            pendingFriends.map(async (friend) => {
                const friendId = friend.toUser._id.toString();
                const followingCount = await this.countFollowing(friendId);
                const countFollowers = await this.countFollowers(friendId)
                return {
                    ...friend,
                    toUser: {
                        ...friend.toUser,
                        followingCount,
                        countFollowers
                    },
                };
            })
        );

        return result;
    }
    async getFriends(userId: string, limit: number) {
        const relations = await this.friendRelationModel
            .find({
                status: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .limit(limit)
            .lean();
        logger.info(`data:${JSON.stringify(relations)}`)
        const friends = await Promise.all(
            relations.map(async (relation) => {
                const friend =
                    relation.fromUser._id.toString() === userId
                        ? relation.toUser
                        : relation.fromUser;

                const followingCount = await this.countFollowing(friend._id.toString());
                const countFollowers = await this.countFollowers(friend._id.toString());

                return {
                    ...friend,
                    followingCount,
                    countFollowers,
                };
            })
        );

        return {
            data: friends
        };
    }

    // Hủy kết bạn
    async unFriend(fromUserId: string, toUserId: string) {
        const unFriend = await this.friendRelationModel.findOneAndDelete({
            status: 'accepted',
            $or: [
                { fromUser: fromUserId, toUser: toUserId },
                { fromUser: toUserId, toUser: fromUserId }
            ]
        });

        if (!unFriend) {
            throw new NotFoundError('Friend relation not found or already removed');
        }

        logger.info(`User ${fromUserId} unfriended user ${toUserId}`);
        return unFriend;
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

    //lay ra mot ban bef
    async getFriendById(userId: string, friendId: string): Promise<FriendRelation | null> {
        const friend = await this.friendRelationModel.findOne({
            $or: [
                { fromUser: userId, toUser: friendId },
                { fromUser: friendId, toUser: userId },
            ],
        }).lean();
        return friend;
    }




    // Xử lý hành động gửi hoặc hủy lời mời kết bạn
    async handleFriendRequestAction(
        fromUser: string,
        toUser: string,
        status: 'send' | 'deleted' | 'accept' | 'reject' | 'unfriend' | 'follow' | 'unfollow'
    ) {
        switch (status) {
            case 'send':
                await this.friendRequest(fromUser, toUser);
                return { message: 'Friend request sent successfully' };

            case 'deleted':
                await this.deleteFriendRequest(fromUser, toUser);
                return { message: 'Friend request cancelled successfully' };
            case 'accept':
                await this.acceptRequest(fromUser, toUser);
                return { message: 'Friend request accepted successfully' };
            case 'reject':
                await this.rejectRequest(fromUser, toUser);
                return { message: 'Friend request rejected successfully' };
            case 'unfriend':
                await this.unFriend(fromUser, toUser);
                return { message: 'Unfriended successfully' };
            case 'follow':
                await this.follow(fromUser, toUser);
                return { message: 'Followed successfully' };
            case 'unfollow':
                await this.unfollow(fromUser, toUser);
                return { message: 'Unfollowed successfully' };

            default:
                throw new BadRequestException(`Unsupported action: ${status}`);
        }


    }



    //userA following userB tinh so isFollowing theo id cua userA status:follow
    //userC muon xem following cua userB truyen id userB vao lay ra SL following cua userB
    async countFollowing(userId: string): Promise<number> {
        return await this.friendRelationModel.countDocuments({
            fromUser: userId,
            isFollowing: 'follow',
        });
    }

    //userA duoc userB Followers tinh so isFollowing theo id cua toUser id cua userA status:follow
    //userC muon xem following cua userA truyen id userA vao lay ra SL following cua userA
    async countFollowers(userId: string): Promise<number> {
        logger.info(`followersId:${userId}`)
        return await this.friendRelationModel.countDocuments({
            toUser: userId,
            isFollowing: 'follow',
        });
    }



    async getFriendListByType(
        userId: string,
        type: 'all' | 'sent' | 'pending' | 'follow',
        limit: number
    ) {
        switch (type) {
            case 'all':
                return this.getFriends(userId, limit);
            case 'sent':
                return this.getSentFriendRequest(userId, limit);
            case 'pending':
                return this.getPendingFriendRequests(userId, limit);
            case 'follow':
                return this.getFollowingRelations(userId, limit);
            default:
                throw new BadRequestException('Invalid type');
        }
    }



    async getFollowingRelations(userId: string, limit: number) {
        return this.friendRelationModel.find({
            fromUser: userId,
            isFollowing: 'follow',
        }).select('toUser').limit(limit).lean();
    }




}

