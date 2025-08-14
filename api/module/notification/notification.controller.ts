import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { NotificationsService } from './notification.service';
import { ApiTags } from '@nestjs/swagger';


@ApiTags("Notification")    
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Post()
    async create(@Body() dto:any) {
       // return await this.notificationsService.create();
    }

    

    @Get('list/:userId')
    async listNotiByUser(@Param('userId') userId: string) {
       // return await this.notificationsService.listNotiByUser(userId);
    }
}
