import {
    Controller,
    Post,
    Body,
    Param,
    Get,
    Patch,
    Delete,
    NotFoundException,
    UseGuards,
    Req
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';

import { SuccessResponse, CREATED } from '../../utils/success.response';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { logger } from '../../utils/logger';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // @Post('create')
    // async createUser(@Body() body: UserDto) {
    //     const result = await this.userService.createUser(body);
    //     return new CREATED({
    //         message: 'User created successfully',
    //         metadata: result,
    //     });
    // }

    // @Get(':id')
    // async getUser(@Param('id') id: string) {
    //     const user = await this.userService.findById(id);
    //     if (!user) throw new NotFoundException('User not found');
    //     return new SuccessResponse({
    //         message: 'User found',
    //         metadata: user,
    //     });
    // }

    // @Patch(':id')
    // async updateUser(@Param('id') id: string, @Body() body: UserDto) {
    //     const user = await this.userService.updateUser(id, body);
    //     if (!user) throw new NotFoundException('User not found');
    //     return new SuccessResponse({
    //         message: 'User updated',
    //         metadata: user,
    //     });
    // }

    // @Delete(':id')
    // async deleteUser(@Param('id') id: string) {
    //     const deleted = await this.userService.deleteUser(id);
    //     if (!deleted) throw new NotFoundException('User not found');
    //     return new SuccessResponse({
    //         message: 'User deleted successfully',
    //         metadata: { id },
    //     });
    // }

    @Get('')
    async getAllUsers(@Param('limit') limit: string) {
        const users = await this.userService.getAllUsers(limit);
        logger.info(`Retrieved ${users.length} users with limit ${limit}`);
        return new SuccessResponse({
            message: 'All users retrieved successfully',
            metadata: {
                users: users,
                limit: limit,
            },
        });
    }
    @UseGuards(AccessTokenGuard)
    @Get('profile')
    async getUserById(@Req() req: Request) {
        const userId = (req as any).user.userId;
        const user = await this.userService.getUserById(userId);
        logger.info(`Retrieved ${user.length} user with ID ${user}`);
        if (!user) throw new NotFoundException('User not found');
        return new SuccessResponse({
            message: 'User found successfully',
            metadata: {
                user:user
            },
        });
    }
}


  