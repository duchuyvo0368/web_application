
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from './notification.model';
import { Notification } from './notification.model';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { NotificationRepository } from './notification.reponsitory';
import { AuthModule } from 'module/auth/module.auth';
@Module({
    imports: [
        MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema }], 'MONGODB_CONNECTION'),
        forwardRef(() => AuthModule),
    ],
    controllers: [NotificationsController],
    providers: [
        NotificationsService,
        NotificationRepository
    ],
    exports: [MongooseModule, NotificationsService],
})
export class NotificationsModule { }
