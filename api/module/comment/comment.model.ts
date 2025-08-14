// notifications.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Post' })
    comment_post_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'User' })
    comment_user_id: Types.ObjectId;

    @Prop({ type: String, required: true })
    comment_content: string;

    @Prop({ type: Types.ObjectId, default: null })
    comment_parent_id: Types.ObjectId;
    
    @Prop({ type: Number, default: null })
    comment_right: number;

    @Prop({ type: Number, default: null })
    comment_left: number;
}

export type CommentDocument = Comment & Document;
export const CommentSchema = SchemaFactory.createForClass(Comment);
