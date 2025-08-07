import {
    Controller,
    Post,
    Param,
    Body,
    Req,
    UseGuards,
} from '@nestjs/common';
import { FeelService } from './feels.service';
import { AuthGuard } from '../auth/guards/access-token.guard'; // tuỳ hệ thống của bạn

@Controller('feel')
@UseGuards(AuthGuard)
export class FeelController {
    constructor(private readonly feelService: FeelService) { }

    @Post(':postId')
    async toggleFeel(
        @Param('postId') postId: string,
        @Body('feel_name') feelName: string,
        @Req() req: any,
    ) {
        const userId = req.user._id;
        const result = await this.feelService.toggleFeel(userId, postId, feelName);
        return { message: 'Success', data: result };
    }
}
