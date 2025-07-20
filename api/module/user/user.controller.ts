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
    UploadedFile,
    Query
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/user.dto';
import { SuccessResponse, CREATED } from '../../utils/success.response';
import { logger } from '../../utils/logger';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
import { ApiBasicAuth, ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'module/auth/guards/access-token.guard';
import { AuthRequest } from 'module/auth/interfaces/auth-request.interface';


@ApiTags('User')
@Controller('user')
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


    
    @ApiQuery({ name: 'limit', example: '12' })
    @ApiQuery({ name: 'page', example: '1' })
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get()
    async getAllUsers(
        @Query('limit') limit: string = '12',
        @Query('page') page:string = '1',
        @Req() req: Request,
    ) {
        const currentUserId = (req as any).user.userId;
        const pageNumber = Math.max(Number(page), 1);
        const limitNumber = Math.max(Number(limit), 1);

        const result = await this.userService.getAllUsers(
            currentUserId,
            limitNumber,
            pageNumber,
        );

        return new SuccessResponse({
            message: 'User list fetched successfully',
            metadata: result,
        });
    }
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get(':userId')
    async getUserProfile(
        @Param('userId') userId: string,
        @Req() req: Request,
    ) {
        const currentUserId = (req as any).user.userId;

        const result = await this.userService.getProfile(
            userId,
            currentUserId,
        );

        return new SuccessResponse({
            message: 'User profile fetched successfully',
            metadata: result,
        });
    }


}


