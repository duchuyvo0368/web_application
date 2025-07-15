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
    Req,
    UploadedFiles,
    UseInterceptors,
    UploadedFile
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { SuccessResponse, CREATED } from '../../utils/success.response';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { logger } from '../../utils/logger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { ApiBasicAuth, ApiParam } from '@nestjs/swagger';

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

    @UseGuards(AccessTokenGuard)
    @ApiParam({ name: 'limit', required: true, example: '10' })
    @Get('')
    async getAllUsers(@Param('limit') limit: string, @Req() req: Request) {
        const userId = (req as any).user.userId;
        const users = await this.userService.getAllUsers(userId, limit);
        logger.info(`Retrieved ${users} users with limit ${limit}`);
        return new SuccessResponse({
            message: 'All users retrieved successfully',
            metadata: {
                users: users,
                limit: limit,
            },
        });
    }
    @ApiBasicAuth()
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
                user: user
            },
        });
    }

    // @UseGuards(AccessTokenGuard)
    // @Patch('follow/:id')
    // async followUser(@Param('id') id: string, @Req() req: Request) {
    //     const currentUserId = (req as any).user.userId;

    //     if (currentUserId === id) {
    //         throw new NotFoundException('You cannot follow yourself');
    //     }

    //     const updatedTarget = await this.userService.updateFollowersCount(id, true);
    //     const updatedCurrent = await this.userService.updateFollowingCount(currentUserId, true); // A

    //     if (!updatedTarget || !updatedCurrent) {
    //         throw new NotFoundException('User not found');
    //     }

    //     return new SuccessResponse({
    //         message: 'Followed successfully',
    //         metadata: {
    //             currentUser: updatedCurrent,
    //             targetUser: updatedTarget,
    //         },
    //     });
    // }

    // @UseGuards(AccessTokenGuard)
    // @Patch('unfollow/:id')
    // async unfollowUser(@Param('id') id: string, @Req() req: Request) {
    //     const currentUserId = (req as any).user.userId;

    //     if (currentUserId === id) {
    //         throw new NotFoundException('You cannot unfollow yourself');
    //     }

    //     const updatedTarget = await this.userService.updateFollowersCount(id, false); // B
    //     const updatedCurrent = await this.userService.updateFollowingCount(currentUserId, false); // A

    //     if (!updatedTarget || !updatedCurrent) {
    //         throw new NotFoundException('User not found');
    //     }

    //     return new SuccessResponse({
    //         message: 'Unfollowed successfully',
    //         metadata: {
    //             currentUser: updatedCurrent,
    //             targetUser: updatedTarget,
    //         },
    //     });
    //   }
    // @Post('upload/avatar')
    // @UseInterceptors(
    //     FileInterceptor('file', {
    //         storage,
    //         limits: {
    //             fileSize: 3 * 1024 * 1024, // 3MB
    //         },
    //         fileFilter(req, file, cb) {
    //             const allowedTypes = ['.jpeg', '.jpg', '.png', '.gif'];
    //             const extName = path.extname(file.originalname).toLowerCase();

    //             if (!allowedTypes.includes(extName)) {
    //                 return cb(
    //                     new Error(
    //                         `Unsupported file type ${extName}. Only JPEG, PNG, and GIF are allowed.`,
    //                     ),
    //                     false,
    //                 );
    //             }
    //             cb(null, true);
    //         },
    //         dest: 'uploads', // không cần nếu đã cấu hình `storage`
    //     }),
    // )
    // uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    //     return {
    //         message: 'Upload thành công!',
    //         file: {
    //             originalname: file.originalname,
    //             filename: file.filename,
    //             size: file.size,
    //             path: file.path,
    //         },
    //     };
    // }
}


