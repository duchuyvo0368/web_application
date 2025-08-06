import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notification.service';


@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    async create(@Body() dto:any) {
       // return await this.notificationsService.create();
    }

    // @Get('user/:userId')
    // async getByUser(@Param('userId') userId: string) {
    //     return await this.notificationsService.getByUser(userId);
    // }
}
