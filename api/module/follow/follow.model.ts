// // src/schemas/follow.schema.ts
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, Types } from 'mongoose';

// export type FollowDocument = Follow & Document;

// @Schema({ timestamps: { createdAt: true, updatedAt: false } })
// export class Follow {
//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   follower: Types.ObjectId;

//   @Prop({ type: Types.ObjectId, ref: 'User', required: true })
//   following: Types.ObjectId;
// }

// export const FollowSchema = SchemaFactory.createForClass(Follow);
