import { async } from 'rxjs';
// friend.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRelation, FriendRelationDocument } from './friend.model';
import mongoose, { Model, Types } from 'mongoose';
import { logger } from 'utils/logger';

@Injectable()
export class FriendRepository {
    isFollowing(toUser: string, fromUser: string): any {
        return this.friendModel.exists({
            type: 'follow',
            fromUser: fromUser,
            toUser: toUser,
        });
    }
    
    constructor(
        @InjectModel(FriendRelation.name, 'MONGODB_CONNECTION')
        private readonly friendModel: Model<FriendRelationDocument>
    ) { }


    async createFriendRelation(
        fromUser: string,
        toUser: string,
        type: 'pending' | 'follow'
    ) {
        return this.friendModel.create({ fromUser, toUser, type });
    }

    //tao loi moi ket ban
    async createRelation(fromUser: string, toUser: string) {
        const relation = await this.createFriendRelation(fromUser, toUser, 'pending');

        await relation.populate('toUser', 'id name avatar');
        await relation.populate('fromUser', 'id name avatar');

        return relation.toObject();
    }



    //tao loi moi theo dõi
    async createFollow(fromUser: string, toUser: string) {
        return this.createFriendRelation(fromUser, toUser, 'follow');
    }

    //update status(accepted)
    async updateRequestToAccepted(id: Types.ObjectId) {
        return this.friendModel.findByIdAndUpdate(
            id,
            { type: 'accepted' },
            { new: true }
        )
            .populate('fromUser', 'id email name avatar') // Populate thêm các trường cần thiết
            .populate('toUser', 'id email name avatar');
    }


    async findPendingFriendRelationBetween(fromUser: string, toUser: string) {
        return this.friendModel.findOne({
            type: 'pending',
            $or: [
                { fromUser: fromUser, toUser: toUser },
                { fromUser: toUser, toUser: fromUser }
            ]
        });
    }
    async findIncomingFollowRequest(receiverId: string, senderId: string) {
        return this.friendModel.findOne({
            fromUser: senderId,
            toUser: receiverId,
            type: 'follow',
        });
    }
    async findIncomingPendingRequest(receiverId: string, senderId: string) {
        return this.friendModel.findOne({
            fromUser: senderId,
            toUser: receiverId,
            type: 'pending',
        });
    }
    async findOutgoingFriendRequest(senderId: string, receiverId: string) {
        return this.friendModel.findOne({
            $or: [
                { fromUser: senderId, toUser: receiverId },
                { fromUser: receiverId, toUser: senderId },

            ],
            type: 'pending',
        });
    }
    async findRelationBetweenUsers(userAId: string, userBId: string) {
        return this.friendModel.findOne({
            $or: [
                { fromUser: userAId, toUser: userBId },
                { fromUser: userBId, toUser: userAId },
                
            ],
            type: { $ne: 'follow' }
        }).lean();
    }
    




    //xoa loi moi ket ban
    async deleteRequestById(id: Types.ObjectId) {
        return this.friendModel.deleteOne({ _id: id });
    }



    // xoa loi moi ket ban
    async unFriendUsers(userId1: string, userId2: string) {
        return this.friendModel.findOneAndDelete({
            type: 'accepted',
            $or: [
                { fromUser: userId1, toUser: userId2 },
                { fromUser: userId2, toUser: userId1 },
            ],
        });
    }


    async query(query: any, page = 1, limit = 10, select?: any) {
        return this.friendModel.find(query)
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .limit(limit)
            .skip((page - 1) * limit)
            .select(select)
            .lean();
    }


    // lay danh sách chưa xác nhận
    async findPendingFriendRequests(
        userId: string,
        limit: number,
        page: number,
    ) {
        const query = { toUser: userId, type: 'pending' };
        return this.query(query, page, limit);
    }
    // danh sach loi moi da gui
    async findPendingSentRequests(
        userId: string,
        limit: number,
        page: number,
    ): Promise<any[]> {
        return this.query({ fromUser: userId, type: 'pending' }, page, limit);
    }



    // Lấy danh sách bạn bè đã accepted với phân trang
    async findAcceptedFriends(userId: string, limit: number, page: number): Promise<any[]> {
        return this.query({
            type: 'accepted',
            $or: [{ fromUser: userId }, { toUser: userId }],
        }, page, limit);
    }

    //  loi moi da gui
    async findRelationsByUserAndTypes(
        userId: string,
        type: ('accepted' | 'pending')[],
    ): Promise<any[]> {
        return this.query({
            $or: [{ fromUser: userId }, { toUser: userId }],
            type: { $in: type },
        });
    }

    async findAcceptedRelationsByUserId(userId: string): Promise<any[]> {
        return this.query({
            type: 'accepted',
            $or: [{ fromUser: userId }, { toUser: userId }],
        });
    }

    async findFollowingsUserId(userId: string, limit: number) {
        return this.query({
            type: 'follow',
            fromUser: userId,
        }, 1, limit, "toUser");
    }



    async isUserFollowingTarget(userId: string, targetId: string): Promise<boolean> {
        const exists = await this.friendModel.exists({
            type: 'follow',
            fromUser: userId,
            toUser: targetId,
        });

        return !!exists;
    }
    async findFollowingsByUserId(userId: string) {
        return this.friendModel
            .find({
                type: 'follow',
                fromUser: userId,
            });
    }


    // Đếm tổng số bạn bè đã accepted
    async countAcceptedFriends(userId: string): Promise<number> {
        return this.friendModel.countDocuments({
            type: 'accepted',
            $or: [{ fromUser: userId }, { toUser: userId }],
        });
    }


    async countFollowingByUserId(userId: string): Promise<number> {
        return this.friendModel.countDocuments({
            fromUser: userId,
            type: 'follow',
        });
    }

    async countFollowersByUserId(userId: string): Promise<number> {
        return this.friendModel.countDocuments({
            toUser: userId,
            type: 'follow',
        });
    }
    async countAcceptedFriendsByUserId(userId: string): Promise<number> {
        return this.friendModel.countDocuments({
            type: 'accepted',
            $or: [
                { fromUser: userId },
                { toUser: userId },
            ],
        });
    }

    async countUserId(userId: string): Promise<number> {
        return this.friendModel.countDocuments({
            fromUser: userId,
            type: 'pending',
        });
    }






    async isFriend(userA: string, userB: string): Promise<boolean> {
        const relation = await this.friendModel.findOne({
            $or: [
                { fromUser: userA, toUser: userB, type: 'accepted' },
                { fromUser: userB, toUser: userA, type: 'accepted' },
            ],
        });
        return !!relation;
    }











}


