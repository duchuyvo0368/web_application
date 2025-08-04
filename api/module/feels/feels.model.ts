import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
// Make sure to import the User model or schema if not already imported


@Schema({ timestamps: true })
export class Feel extends Document {
    @Prop({ type: Types.ObjectId, required: true })
    post_id: Types.ObjectId;


    @Prop({ type: Types.ObjectId, required: true })
    user_post_id: Types.ObjectId;

    @Prop({ type: String, enum: ['reaction', 'view', 'share', 'comment', ], required: true })
    feel_type: string;

    @Prop({ type: Map, of: Number, default: {} })
    count_feelings: Map<string, number>;

    @Prop({ type: Number, default: 0 })
    count_comments: number;


    @Prop({ type: Number, default: 0 })
    count_views: number;

    @Prop()
    feel_name?: string;

    @Prop()
    feel_image?: string;
}



export type FeelRelation = Feel & Document;

export const FeelSchema = SchemaFactory.createForClass(Feel);
