import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type FriendRelationDocument = FriendRelation & Document;

@Schema({ timestamps: true })
export class FriendRelation {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    fromUser: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    toUser: Types.ObjectId;

    @Prop({
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: null,
    })
    status: string|null;

    @Prop({
        type: String,
        enum: ['follow', 'unfollow'],
        default: 'unfollow',
    })
    isFollowing: string;


    @Prop({ type: Date, default: null })
    acceptedAt?: Date;
}

export const FriendSchema =
    SchemaFactory.createForClass(FriendRelation);
