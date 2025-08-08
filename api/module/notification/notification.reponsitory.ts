import { InjectModel } from "@nestjs/mongoose";
import { Notification, NotificationDocument, NotificationSchema } from "./notification.model";
import { Model } from "mongoose";

export class NotificationRepository {
    constructor(
        @InjectModel(Notification.name, 'MONGODB_CONNECTION')
        private notificationModel: Model<NotificationDocument>,
    ) { }

    async createNotification(senderId: string, receivedId: string, noti_content: string, noti_type: string, options: any) {
        const newNotification = await this.notificationModel.create({
            noti_type: noti_type,
            noti_content: noti_content,
            noti_from: senderId,
            noti_to: receivedId,
            noti_options: options,
        });
        return newNotification;
    }

    async getByUser(userId: string) {
        return await this.notificationModel
            .find({ noti_receivedId: userId })
            .sort({ createdAt: -1 })
            .exec();
    }
}