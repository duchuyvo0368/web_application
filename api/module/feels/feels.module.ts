import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feel, FeelSchema } from './feels.model';
import { FeelService } from './feels.service';
import { FeelController } from './feels.controller';
import { AuthModule } from 'module/auth/module.auth';

@Module({
    imports: [
        MongooseModule.forFeature(
            [{ name: Feel.name, schema: FeelSchema }],
            'MONGODB_CONNECTION',
        ),
        AuthModule,
    ],
    controllers: [FeelController],
    providers: [FeelService],
    exports: [FeelService],
})
export class FeelModule { }
