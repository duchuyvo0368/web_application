// src/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';


export type UserDocument = User & Document;
@Schema({ timestamps: true, collection: 'Users' })
export class User {
    @Prop({ trim: true, maxLength: 150 })
    name: string;

    @Prop({ required: true, unique: true, trim: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ type: String, default: 'https://sbcf.fr/wp-content/uploads/2018/03/sbcf-default-avatar.png' }) // Default avatar URL
    avatar?: string;

    @Prop({ type: String, default: null })
    bio?: string;
}

// 3. Schema factory
export const UserSchema = SchemaFactory.createForClass(User);
