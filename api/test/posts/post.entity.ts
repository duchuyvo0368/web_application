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
          enum: ['public', 'friend'],
          default: 'public',
     })
    privacy: string;
    
     @Prop({ type: [String], default: [] })
     images: string[];

     @Prop({ type: [String], default: [] })
     videos: string[];
     
     @Prop({
          type: {
               post_link_url: String,
               post_link_title: String,
               post_link_description: String,
               post_link_content: String,
               post_link_image: String,
          },
          default: null,
     })
     post_link_meta?: {
          post_link_url: string;
          post_link_title?: string;
          post_link_description?: string;
          post_link_content?: string;
          post_link_image?: string;
     };

     @Prop({ type: [String], default: [] })
     hashtags?: string[]
     @Prop({ type: String, default: null })
     content: string

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
