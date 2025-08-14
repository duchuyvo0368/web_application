
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentSchema } from './comment.model';
import { Comment } from './comment.model';
import { CommentService } from './comment.service';
import { CommentRepository } from './comment.repository';
import { AuthModule } from 'module/auth/module.auth';
import { CommentController } from './comment.controller';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }], 'MONGODB_CONNECTION'),
        forwardRef(() => AuthModule),
    ],
    controllers: [CommentController],
    providers: [
        CommentService,
        CommentRepository,
    ],
    exports: [MongooseModule, CommentService],
})
export class CommentModule { }
