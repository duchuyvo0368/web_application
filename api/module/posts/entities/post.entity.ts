import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Make sure to import the User model or schema if not already imported

@Schema({ timestamps: true })
export class Post {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
    @Prop({ type: String, required: true })
    title: string;
    @Prop({
        type: String,
        enum: ['public', 'private', 'friend', 'followers'],
        default: 'public',
    })
    status: string;
    @Prop({ type: [String], default: [] })
    images: string[];
    @Prop({ type: Number, default: 0 })
    likesCount: number;
    @Prop({ type: Number, default: 0 })
    commentsCount: number;
    @Prop({ type: Date, default: Date.now })
    createdAt: Date;
    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export type PostRelation = Post & Document;

export const PostSchema = SchemaFactory.createForClass(Post);
