import { Controller, Post, Body, Get, BadRequestException, Res, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { LoginUserDto } from './dto/login.dto';
import { BadRequestError } from '../../utils/error.response';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { logger } from '../../utils/logger';
import { AuthGuard } from './guards/access-token.guard';
import { AuthRequest } from './interfaces/auth-request.interface';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

// Define AuthRequest interface if not already defined elsewhere



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() registerUserDto: RegisterDto, @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
        try {
            const result = await this.authService.register(registerUserDto);
            return new CREATED({
                message: 'Create user successfully',
                metadata: result,
            });
        } catch (e) {
            throw new BadRequestError(e.message || 'Error creating user');
        }
    }

    @Post('login')
    async loginUser(
        @Body() loginUserDto: LoginUserDto,
        @Res({ passthrough: true }) res: Response
    ) {

        const result = await this.authService.loginUser(loginUserDto);
        return new SuccessResponse({
            message: 'Login successfully',
            metadata: result,
        });

    }


    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        const userId = (req as any).user.userId;
        logger.info(`User ID from request: ${userId}`);
        logger.info(`Logging out userId: ${userId}`);
        await this.authService.logout(userId);
        return { message: 'Logout successfully' };
    }


    @ApiHeader({
        name: 'x-refresh-token',
        description: 'refresh token',
        required: true,
        example: 'your-refresh-token-here',
    })

    @Post('refresh-token')
    @UseGuards(RefreshTokenGuard)
    async handlerRefreshToken(
        @Res({ passthrough: true }) res: Response,
        @Req() req: AuthRequest,
    ) {
        const user = req.user;
        const refreshToken = req.refreshToken;
        if (!refreshToken) {
            throw new BadRequestException('Refresh token is required');
        }
        logger.info(`Received refresh token for userId: ${user}, email: ${user}`);
        if (!user) {
            throw new UnauthorizedException('User not found in request');
        }
        const result = await this.authService.handlerRefreshToken(
            refreshToken,
            user.userId,
            user.email
        );
        return new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: result,
        });
    }


}

