import { SuccessResponse } from './../../utils/success.response';

import {
    Injectable,
    BadRequestException,
    NotFoundException,
    ForbiddenException,
    ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import {
    BadRequestError,
    FORBIDDEN,
    NotFoundError,
} from '../../utils/error.response';
import { convertToObject, getInfoData } from '../../utils/index';
import { logger } from '../../utils/logger';
import { FORBIDDEN_MESSAGE } from '@nestjs/core/guards';
import { filter } from 'lodash';
import { from } from 'rxjs';
import { FriendRepository } from './model/friend.repository';
@Injectable()
export class FriendService {
    constructor(
        private readonly friendRepository: FriendRepository,
    ) { }


    ///follow->add friend->unfollow error
    //2 nguoi cung ket gui mot luc
    // gửi lời mời kết bạn
    async friendRequest(fromUser: string, toUser: string) {
        if (fromUser === toUser) {
            throw new BadRequestException(
                'You cannot send a friend request to yourself',
            );
        }

        const existing = await this.friendRepository.findPendingFriendRelationBetween(fromUser, toUser);


        if (existing?.type === 'pending') {
            throw new BadRequestException('Friend request already sent');
        }

        if (existing?.type === 'accepted') {
            throw new BadRequestException('You are already friends');
        }
        const created = await this.friendRepository.createRelation(fromUser, toUser);

        return {
            message: 'Friend request sent',
            data: created,
        };
    }

    // Xử lý chấp nhận lời mời kết bạn
    async acceptRequest(fromUser: string, toUser: string) {
        const request = await this.friendRepository.findIncomingPendingRequest(fromUser, toUser);

        if (!request) {
            throw new BadRequestException('Friend request not found');
        }

        if (request.type !== 'pending') {
            throw new BadRequestException('Cannot accept non-pending request');
        }

        if (fromUser !== request.toUser.toString()) {
            throw new ForbiddenException('Not authorized to accept this request');
        }

        await this.friendRepository.updateRequestToAccepted(request.id);

        return {
            message: 'Friend request accepted',
            data: {
                fromUser,
                toUser,
                type: 'accepted',
            },
        };
    }



    // Xử lý từ chối lời mời kết bạn
    async rejectRequest(fromUser: string, toUser: string) {
        const request = await this.friendRepository.findIncomingPendingRequest(fromUser, toUser);

        if (!request) {
            throw new NotFoundException(
                'Friend request not found or already processed',
            );
        }

        if (fromUser !== request.toUser.toString()) {
            throw new ForbiddenException('Not authorized to reject this request');
        }

        await this.friendRepository.deleteRequestById(request.id);

        return {
            message: 'Friend request rejected',
            data: { fromUser, toUser: fromUser, type: 'rejected' },
        };
    }

    // thu hồi một lời mời kết bạn
    async deleteFriendRequest(fromUser: string, toUser: string) {
        logger.info(`Deleting friend request from ${fromUser} to ${toUser}`);
        const request = await this.friendRepository.findOutgoingFriendRequest(fromUser, toUser);
        logger.info(`Found request: ${JSON.stringify(request)}`);
        if (!request) {
            throw new NotFoundException('Friend request not found');
        }

        await this.friendRepository.deleteRequestById(request.id);

        return { message: 'Friend request deleted (no follow)' };
    }

    // Theo dõi (follow)
    async follow(fromUser: string, toUser: string) {
        if (fromUser === toUser)
            throw new BadRequestException('Cannot follow yourself');
        const existing = await this.friendRepository.findIncomingFollowRequest(fromUser, toUser);
        if (!existing) {
            await this.friendRepository.createFollow(fromUser, toUser);
            return { message: 'Followed successfully' };
        }

        throw new BadRequestException(
            'Cannot follow in current relationship state',
        );
    }

    // Hủy theo dõi
    async unfollow(fromUser: string, toUser: string) {
        logger.info(`data unfollow: ${fromUser} +${toUser}`);
        const relation = await this.friendRepository.findIncomingFollowRequest(fromUser, toUser);
        if (!relation) {
            throw new BadRequestException('You are not following this person');
        }
        await this.friendRepository.deleteRequestById(relation.id);
        return { message: 'Unfollowed successfully' };
    }

    // Lấy danh sách lời mời đến chưa xác nhận
    async getPendingFriendRequests(userId: string, limit: number, page: number) {
        const pendingRequests = await this.friendRepository.findPendingFriendRequests(userId, limit, page);

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
            }),
        );

        return result;
        // pagination: {
        //      totalItems,
        //           currentPage: page,
        //                totalPages: Math.ceil(totalItems / limit),
        //                     limit,
        //      },
    }

    // Hủy kết bạn
    async unFriend(fromUserId: string, toUserId: string) {
        const unFriend = await this.friendRepository.unFriendUsers(fromUserId, toUserId);
        if (!unFriend) {
            throw new NotFoundError('Friend relation not found or already removed');
        }

        logger.info(`User ${fromUserId} unfriended user ${toUserId}`);
        return unFriend;
    }

    //lấy danh sách lời mời đã gửi
    async getSentFriendRequest(userId: string, limit: number, page: number) {
        const pendingFriends = await this.friendRepository.findPendingSentRequests(userId, limit, page);

        const result = await Promise.all(
            pendingFriends.map(async (friend) => {
                const friendId = friend.toUser._id.toString();
                const followingCount = await this.countFollowing(friendId);
                const countFollowers = await this.countFollowers(friendId);
                return {
                    ...friend,
                    toUser: {
                        ...friend.toUser,
                        followingCount,
                        countFollowers,
                    },
                };
            }),
        );

        return result;
        // pagination: {
        //      totalItems,
        //           currentPage: page,
        //                totalPages: Math.ceil(totalItems / limit),
        //                     limit,
        //      },
    }

    //lay danh sách bạn bè
    async getFriends(userId: string, limit: number, page: number) {
        const skip = (page - 1) * limit;

        // Tìm tổng số bạn bè accepted
        const totalItems = await this.friendRepository.countAcceptedFriends(userId);
        const relations = await this.friendRepository.findAcceptedFriends(userId, limit, page)
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
            }),
        );
        return {
            data: friends,
            pagination: {
                totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                limit,
            },
        };
    }


    //lấy danh sách bạn bè lời mời đã gửi đề trừ khỏi list user
    async getRelatedUserIds(userId: string): Promise<string[]> {
        const relations = await this.friendRepository.findRelationsByUserAndTypes(userId, ['accepted', 'pending']);

        const relatedIds = new Set<string>();

        for (const rel of relations) {
            const otherId =
                rel.fromUser.toString() === userId
                    ? rel.toUser.toString()
                    : rel.fromUser.toString();

            relatedIds.add(otherId);
        }
        relatedIds.add(userId);

        return Array.from(relatedIds);
    }

    //lay ra mot ban bef
    async findAnyRelationBetweenUsers(
        userId: string,
        id: string,
    ): Promise<any | null> {
        const friend = await this.friendRepository.findRelationBetweenUsers(userId, id)
        return friend;
    }

    // bạn bè
    async getFriendUserIds(userId: string): Promise<string[]> {
        const relations = await this.friendRepository.findAcceptedRelationsByUserId(userId)

        return relations.map((rel) =>
            rel.fromUser.toString() === userId
                ? rel.toUser.toString()
                : rel.fromUser.toString(),
        );
    }

    //check follow
    async isFollowing(userId: string, targetId: string): Promise<boolean> {
        const exists = await this.friendRepository.isUserFollowingTarget(userId, targetId);
        return !!exists;
    }
    //lấy follow theo userId
    async getFollowingUserIds(userId: string): Promise<string[]> {
        const followRelations = await this.friendRepository.findFollowingsByUserId(userId);

        return followRelations.map(rel => rel.toUser.toString());
    }


    
    async handleFriendRequestAction(
        fromUser: string,
        toUser: string,
        type:
            | 'send'
            | 'deleted'
            | 'accept'
            | 'reject'
            | 'unfriend'
            | 'follow'
            | 'unfollow',
    ) {
        switch (type) {
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

    //userA following userB tinh so Following theo id cua userA type:follow
    //userC muon xem following cua userB truyen id userB vao lay ra SL following cua userB
    async countFollowing(userId: string): Promise<number> {
        return await this.friendRepository.countFollowingByUserId(userId);
    }

    //userA duoc userB Followers tinh so Following theo id cua toUser id cua userA type:follow
    //userC muon xem following cua userA truyen id userA vao lay ra SL following cua userA
    async countFollowers(userId: string): Promise<number> {
        logger.info(`followersId:${userId}`);

        return await this.friendRepository.countFollowersByUserId(userId);
    }

    //so lưong bạn be
    async countFriends(userId: string): Promise<number> {
        return this.friendRepository.countAcceptedFriendsByUserId(userId);
    }

    async getFriendListByType(
        userId: string,
        type: 'all' | 'sent' | 'pending' | 'follow',
        limit: number,
    ) {
        let message = '';
        let result: any;

        switch (type) {
            case 'all':
                message = 'Friend list fetched successfully';
                result = await this.getFriends(userId, limit, 1);
                break;
            case 'sent':
                message = 'Sent friend requests fetched successfully';
                result = await this.getSentFriendRequest(userId, limit, 1);
                break;
            case 'pending':
                message = 'Pending friend requests fetched successfully';
                result = await this.getPendingFriendRequests(userId, limit, 1);
                break;
            case 'follow':
                message = 'Follow list fetched successfully';
                result = await this.getFollowingRelations(userId, limit);
                break;
            default:
                throw new BadRequestException('Invalid type');
        }

        return { message, result };
    }

    async getFollowingRelations(userId: string, limit: number) {
        return this.friendRepository.findFollowingsUserId(userId, limit);
    }




   
    async isFriend(userA: string, userB: string): Promise<boolean> {
        return await this.friendRepository.isFriend(userA,userB)
    }

}
