import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Make sure to import the User model or schema if not already imported

@Schema({ timestamps: true })
export class Follow {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    followingId: Types.ObjectId;
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    followerId: Types.ObjectId;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export type FollowRelation = Follow & Document;

export const FollowSchema = SchemaFactory.createForClass(Follow);
