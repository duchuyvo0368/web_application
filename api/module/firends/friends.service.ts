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
     FriendRelation,
     FriendRelationDocument,
} from './entities/friend.model';
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
@Injectable()
export class FriendService {
     constructor(
          @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
          private friendRelationModel: Model<FriendRelationDocument>,
     ) { }

     // gửi lời mời kết bạn
     async friendRequest(fromUser: string, toUser: string) {
          if (fromUser === toUser) {
               throw new BadRequestException(
                    'You cannot send a friend request to yourself',
               );
          }

          const existing = await this.friendRelationModel.findOne({
               fromUser,
               toUser,
          });

          if (existing) {
               if (existing.type === 'pending') {
                    throw new BadRequestException('Friend request already sent');
               }

               if (existing.type === 'accepted') {
                    throw new BadRequestException('You are already friends');
               }

               existing.type = 'pending';
               await existing.save();

               return {
                    message: 'Friend request re-sent',
                    data: existing,
               };
          }

          const created = await this.friendRelationModel.create({
               fromUser,
               toUser,
               type: 'pending',
          });

          return {
               message: 'Friend request sent',
               data: created,
          };
     }

     // Xử lý chấp nhận lời mời kết bạn
     async acceptRequest(fromUser: string, toUser: string) {
          const request = await this.friendRelationModel.findOne({
               fromUser: toUser,
               toUser: fromUser,
               type: 'pending',
          });

          if (!request) {
               throw new BadRequestException('Friend request not found');
          }

          if (request.type !== 'pending') {
               throw new BadRequestException('Cannot accept non-pending request');
          }

          if (fromUser !== request.toUser.toString()) {
               throw new ForbiddenException('Not authorized to accept this request');
          }

          await this.friendRelationModel.updateOne(
               { _id: request._id },
               {
                    $set: {
                         type: 'accepted',
                         acceptedAt: new Date(),
                    },
               },
          );

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
          const request = await this.friendRelationModel.findOne({
               fromUser: toUser,
               toUser: fromUser,
               type: 'pending',
          });

          if (!request) {
               throw new NotFoundException(
                    'Friend request not found or already processed',
               );
          }

          if (fromUser !== request.toUser.toString()) {
               throw new ForbiddenException('Not authorized to reject this request');
          }

          await this.friendRelationModel.deleteOne({ _id: request._id });

          return {
               message: 'Friend request rejected',
               data: { fromUser, toUser: fromUser, type: 'rejected' },
          };
     }

     // thu hồi một lời mời kết bạn
     async deleteFriendRequest(fromUser: string, toUser: string) {
          const request = await this.friendRelationModel.findOne({
               fromUser,
               toUser,
               type: 'pending',
          });

          if (!request) {
               throw new NotFoundException('Friend request not found');
          }

          await this.friendRelationModel.deleteOne({ _id: request._id });

          return { message: 'Friend request deleted (no follow)' };
     }

     // Theo dõi (follow)
     async follow(fromUser: string, toUser: string) {
          if (fromUser === toUser)
               throw new BadRequestException('Cannot follow yourself');
          const existing = await this.friendRelationModel.findOne({
               fromUser,
               toUser,
               type: 'follow',
          });
          if (!existing) {
               await this.friendRelationModel.create({
                    fromUser,
                    toUser,
                    type: 'follow',
               });
               return { message: 'Followed successfully' };
          }

          throw new BadRequestException(
               'Cannot follow in current relationship state',
          );
     }

     // Hủy theo dõi
     async unfollow(fromUser: string, toUser: string) {
          logger.info(`data unfollow: ${fromUser} +${toUser}`);
          const relation = await this.friendRelationModel.findOne({
               fromUser,
               toUser,
               type: 'follow',
          });
          if (!relation) {
               throw new BadRequestException('You are not following this person');
          }
          await this.friendRelationModel.deleteOne({ _id: relation._id });
          return { message: 'Unfollowed successfully' };
     }

     // Lấy danh sách lời mời đến chưa xác nhận
     async getPendingFriendRequests(userId: string, limit: number, page: number) {
          const skip = (page - 1) * limit;
          const pendingRequests = await this.friendRelationModel
               .find({ toUser: userId, type: 'pending' })
               .populate('fromUser', 'name avatar email')
               .limit(limit)
               .skip(skip)
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
          const unFriend = await this.friendRelationModel.findOneAndDelete({
               type: 'accepted',
               $or: [
                    { fromUser: fromUserId, toUser: toUserId },
                    { fromUser: toUserId, toUser: fromUserId },
               ],
          });

          if (!unFriend) {
               throw new NotFoundError('Friend relation not found or already removed');
          }

          logger.info(`User ${fromUserId} unfriended user ${toUserId}`);
          return unFriend;
     }

     //lấy danh sách lời mời đã gửi
     async getSentFriendRequest(userId: string, limit: number, page: number) {
          const skip = (page - 1) * limit;
          const pendingFriends = await this.friendRelationModel
               .find({ fromUser: userId, type: 'pending' })
               .populate('toUser', 'name avatar email')
              // .skip(skip)
               .limit(limit)
               .lean();

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
          const totalItems = await this.friendRelationModel.countDocuments({
               type: 'accepted',
               $or: [{ fromUser: userId }, { toUser: userId }],
          });

          const relations = await this.friendRelationModel
               .find({
                    type: 'accepted',
                    $or: [{ fromUser: userId }, { toUser: userId }],
               })
               .populate('fromUser', 'name avatar email')
               .populate('toUser', 'name avatar email')
               .skip(skip)
               .limit(limit)
               .lean();

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
          const relations = await this.friendRelationModel
               .find({
                    $or: [{ fromUser: userId }, { toUser: userId }],
                    type: { $in: ['accepted', 'pending'] },
               })
               .lean();

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
     async getFriendById(
          userId: string,
          id: string,
     ): Promise<FriendRelation | null> {
          const friend = await this.friendRelationModel
               .findOne({
                    $or: [
                         { fromUser: userId, toUser: id },
                         { fromUser: id, toUser: userId },
                    ],
               })
               .lean();
          return friend;
     }

     // bạn bè
     async getFriendUserIds(userId: string): Promise<string[]> {
          const relations = await this.friendRelationModel
               .find({
                    type: 'accepted',
                    $or: [{ fromUser: userId }, { toUser: userId }],
               })
               .lean();

          return relations.map((rel) =>
               rel.fromUser.toString() === userId
                    ? rel.toUser.toString()
                    : rel.fromUser.toString(),
          );
     }

     //check follow
     async isFollowing(userId: string, targetId: string): Promise<boolean> {
          const exists = await this.friendRelationModel.exists({
               type: 'follow',
               fromUser: userId,
               toUser: targetId,
          });

          return !!exists;
     }
     //lấy follow theo userId
     async getFollowingUserIds(userId: string): Promise<string[]> {
          const followRelations = await this.friendRelationModel.find({
               type: 'follow',
               fromUser: userId,
          }).lean();

          return followRelations.map(rel => rel.toUser.toString());
     }


     // Xử lý hành động gửi hoặc hủy lời mời kết bạn
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
          return await this.friendRelationModel.countDocuments({
               fromUser: userId,
               type: 'follow',
          });
     }

     //userA duoc userB Followers tinh so Following theo id cua toUser id cua userA type:follow
     //userC muon xem following cua userA truyen id userA vao lay ra SL following cua userA
     async countFollowers(userId: string): Promise<number> {
          logger.info(`followersId:${userId}`);

          return await this.friendRelationModel.countDocuments({
               toUser: userId,
               type: 'follow',
          });
     }

     //so lưong bạn be
     async countFriends(userId: string): Promise<number> {
          return this.friendRelationModel.countDocuments({
               type: 'accepted',
               $or: [
                    { fromUser: userId },
                    { toUser: userId },
               ],
          });
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
          return this.friendRelationModel
               .find({
                    fromUser: userId,
                    type: 'follow',
               })
               .select('toUser')
               .limit(limit)
               .lean();
    }
    
    //tim kiem ban b 
    async searchFriendUsers(userId: string, query: string, limit: number, page: number) {
        const skip = (page - 1) * limit;
        const objectId = new Types.ObjectId(userId);

       const relations = await this.friendRelationModel
            .find({
                type: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .skip(skip)
            .limit(limit)
            .lean();

        logger.info(`Logger:${relations}`)
        const friends = relations.map(rel => {
            const from = rel.fromUser as any;
            const to = rel.toUser as any;
            if (!from || !to) return null;
            return from._id.equals(objectId) ? to : from;
        }).filter(Boolean);

        const lowerQuery = query.toLowerCase();
        const filtered = friends.filter(user => {
            const text = `${user.name} ${user.avatar} ${user.email}`.toLowerCase();
            return text.includes(lowerQuery);
        });

        return filtered.slice(0, 10);
    }




}
