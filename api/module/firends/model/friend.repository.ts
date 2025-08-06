// friend.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendRelation, FriendRelationDocument } from './friend.model';
import { Model, Types } from 'mongoose';
import { logger } from 'utils/logger';

@Injectable()
export class FriendRepository {
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
        return this.createFriendRelation(fromUser, toUser, 'pending');
    }

    //tao loi moi theo dõi
    async createFollow(fromUser: string, toUser: string) {
        return this.createFriendRelation(fromUser, toUser, 'follow');
    }

    // //update status(accepted)
    async updateRequestToAccepted(id: Types.ObjectId) {
        return this.friendModel.updateOne(
            { _id: id },
            {
                $set: {
                    type: 'accepted',
                    acceptedAt: new Date(),
                },
            },
        );
    }
   

    async findFriendRelation(
        fromUser: string,
        toUser: string,
        options: { type?: string; bidirectional?: boolean; lean?: boolean } = {}
    ) {
        const { type, bidirectional = false, lean = false } = options;

        const baseCondition = bidirectional
            ? { $or: [{ fromUser, toUser }, { fromUser: toUser, toUser: fromUser }] }
            : { fromUser, toUser };

        const query = this.friendModel.findOne(type ? { ...baseCondition, type } : baseCondition);
        return lean ? query.lean() : query;
    }



    //mối quan hệ pending 2 chiều
    async findPendingFriendRelationBetween(fromUser: string, toUser: string) {
        return this.findFriendRelation(fromUser, toUser, { type: 'pending', bidirectional: true });
    }

    // lời mời theo dõi 
    async findIncomingFollowRequest(receiverId: string, senderId: string) {
        return this.findFriendRelation(receiverId, senderId, { type: 'follow' });
    }

    // lời mời kết bạn gửi  (pending 1 chiều)
    async findIncomingPendingRequest(receiverId: string, senderId: string) {
        return this.findFriendRelation(senderId, receiverId, { type: 'pending' });
    }

    // ời mời kết bạn đã gửi (pending 1 chiều ngược lại)
    async findOutgoingFriendRequest(receiverId: string, senderId: string) {
        return this.findFriendRelation(receiverId, senderId, { type: 'pending' });
    }

    // Tìm mọi loại quan hệ giữa 2 user 
    async findRelationBetweenUsers(userAId: string, userBId: string) {
        return this.findFriendRelation(userAId, userBId, { bidirectional: true, lean: true });
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


    // lay danh sách chưa xác nhận
    async findPendingFriendRequests(
        userId: string,
        limit: number,
        page: number,
    ) {
        const skip = (page - 1) * limit;
        return this.friendModel
            .find({ toUser: userId, type: 'pending' })
            .populate('fromUser', 'name avatar email')
            .limit(limit)
            .skip(skip)
            .lean();
    }
    // danh sach loi moi da gui
    async findPendingSentRequests(
        userId: string,
        limit: number,
        page: number,
    ): Promise<any[]> {
        const skip = (page - 1) * limit;
        return this.friendModel
            .find({ fromUser: userId, type: 'pending' })
            .populate('toUser', 'name avatar email')
            .limit(limit)
            //.skip(skip)
            .lean();
    }



    // Lấy danh sách bạn bè đã accepted với phân trang
    async findAcceptedFriends(userId: string, limit: number, page: number): Promise<any[]> {
        const skip = (page - 1) * limit;

        return this.friendModel
            .find({
                type: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .populate('fromUser', 'name avatar email')
            .populate('toUser', 'name avatar email')
            .skip(skip)
            .limit(limit)
            .lean();
    }

    //  loi moi da gui
    async findRelationsByUserAndTypes(
        userId: string,
        types: ('accepted' | 'pending')[],
    ): Promise<any[]> {
        return this.friendModel
            .find({
                $or: [{ fromUser: userId }, { toUser: userId }],
                type: { $in: types },
            })
            .lean();
    }

    async findAcceptedRelationsByUserId(userId: string): Promise<any[]> {
        return this.friendModel
            .find({
                type: 'accepted',
                $or: [{ fromUser: userId }, { toUser: userId }],
            })
            .lean();
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
            })
            .lean();
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

    async isFriend(userA: string, userB: string): Promise<boolean> {
        const relation = await this.friendModel.findOne({
            $or: [
                { fromUser: userA, toUser: userB, type: 'accepted' },
                { fromUser: userB, toUser: userA, type: 'accepted' },
            ],
        });
        return !!relation;
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

    async findFollowingsUserId(userId: string, limit: number) {
        return this.friendModel
            .find({
                fromUser: userId,
                type: 'follow',
            })
            .select('toUser')
            .limit(limit)
            .lean();
    }





}


