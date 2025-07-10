import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    fromUser: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    toUser: Types.ObjectId;
}

export type FollowRelation = Follow & Document;

export const FollowSchema = SchemaFactory.createForClass(Follow);
