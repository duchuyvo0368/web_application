import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './notification.model';
import { Model } from 'mongoose';
import { NotificationRepository } from './notification.reponsitory';


@Injectable()
export class NotificationsService {
    constructor(
        private notificationRepository: NotificationRepository,
    ) { }

    //senderId:người gửi
    //receivedId: người nhận
    async pushNotification(
        senderId: string,
        receivedId: string,
        type: string,
        options: { senderName: string; receiverName: string }
    ) {
        let noti_content = '';

        if (type === 'friend_request') {
            noti_content = `${options.senderName} sent a friend request to ${options.receiverName}.`;
        } else if (type === 'friend_accept') {
            noti_content = `${options.senderName} accepted your friend request.`;
        } else if (type === 'comment') {
            noti_content = `${options.senderName} commented on your post.`;
        } else if (type === 'like') {
            noti_content = `${options.senderName} liked your post.`;
        }

        const newNotification = await this.notificationRepository.createNotification(
            senderId,
            receivedId,
            noti_content,
            type,
            options
        );

        return newNotification;
    }

    //lấy thông báo theo người dùng
    async getByUser(userId: string) {
        return await this.notificationRepository.getByUser(userId);
    }
}
