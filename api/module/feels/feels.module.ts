import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'module/auth/module.auth';
import { Feel, FeelSchema } from './feels.model';
import { FeelController } from './feels.controller';
import { FeelService } from './feels.service';
import { PostsModule } from 'module/posts/posts.module';

@Module({
    imports: [
        MongooseModule.forFeature(
            [
                { name: Feel.name, schema: FeelSchema },
            ],
            'MONGODB_CONNECTION'
        ),
        PostsModule,
        AuthModule,
       

    ],
    controllers: [FeelController],
    providers: [FeelService],
    exports: [MongooseModule, FeelService],
})
export class FeelModule { }
