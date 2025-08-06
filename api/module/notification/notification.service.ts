import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './notification.model';
import { Model } from 'mongoose';


@Injectable()
export class NotificationsService {
    constructor(
        @InjectModel(Notification.name)
        private notificationModel: Model<NotificationDocument>,
    ) { }

    async pushNotification(userId: string, type: string, message: string) {
        return await this.notificationModel.create({
            noti_receivedId: userId,
            noti_type: type,
            noti_message: message,
        });
    }

    async getByUser(userId: number) {
        return await this.notificationModel
            .find({ noti_receivedId: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
}
