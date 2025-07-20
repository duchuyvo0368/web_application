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

    @Prop({ type: String, default: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/new-year-background-736885_1280.jpg' }) // 
    avatar?: string;

    @Prop({ type: String, default: null })
    bio?: string;
}

// 3. Schema factory
export const UserSchema = SchemaFactory.createForClass(User);
