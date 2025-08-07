// feel.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Feel, FeelSchema } from './feels.model';
import { FeelController } from './feels.controller';
import { FeelService } from './feels.service';
import { FeelRepository } from './feel.repository';

@Module({
    imports: [MongooseModule.forFeature([{ name: Feel.name, schema: FeelSchema }])],
    controllers: [FeelController],
    providers: [FeelService, FeelRepository],
    exports: [FeelService, FeelRepository], 
})
export class FeelModule { }
