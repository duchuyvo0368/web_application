import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.model';
import { NotificationsController } from './notification.controller';
import { NotificationsService } from './notification.service';
import { NotificationRepository } from './notification.reponsitory';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Notification.name, schema: NotificationSchema },
        ],
        'MONGODB_CONNECTION'
        ),
    ],
    controllers: [NotificationsController],
    providers: [NotificationsService, NotificationRepository],
    exports: [NotificationsService],
})
export class NotificationsModule { }
