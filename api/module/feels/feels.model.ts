import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Feel {
    @Prop({ type: Types.ObjectId, required: true })
    post_id: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true })
    user_id: Types.ObjectId;

    // @Prop({ type: String, enum: ['reaction', 'view', 'share', 'comment'], required: true })
    // feel_type: string;

    @Prop({ type: String, enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'], default: 'like' })
    feel_name?: string;

    @Prop({ type: String, default: '' })
    feel_image?: string;

    @Prop({ type: Number, default: 0 })
    price?: number;

    @Prop({ type: Map, of: Number, default: {} })
    count_feelings: Map<string, number>;

    @Prop({ type: Number, default: 0 })
    count_comments: number;

    @Prop({ type: Number, default: 0 })
    count_views: number;
}

export type FeelDocument = Feel & Document;
export const FeelSchema = SchemaFactory.createForClass(Feel);
