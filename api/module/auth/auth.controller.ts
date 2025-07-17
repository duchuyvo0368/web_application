import { Controller, Post, Body, Get, BadRequestException, Res, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { CREATED, SuccessResponse } from '../../utils/success.response';
import { LoginUserDto } from './dto/login.dto';
import { BadRequestError } from '../../utils/error.response';
import { RegisterDto } from './dto/register.dto';
import { ApiBearerAuth, ApiBody, ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';
import { log } from 'console';
import { logger } from '../../utils/logger';
import { AccessTokenGuard } from './guards/access-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() registerUserDto: RegisterDto, @Res({ passthrough: true }) res: Response,
        @Req() req: Request) {
        try {
            const result = await this.authService.register(registerUserDto);
            res.cookie('accessToken', result.tokens?.accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('refreshToken', result.tokens?.refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
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
        try {
            const result = await this.authService.loginUser(loginUserDto);

            res.cookie('accessToken', result.tokens.accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000,
            });
            res.cookie('refreshToken', result.tokens.refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return new SuccessResponse({
                message: 'Login successfully',
                metadata: result,
            });
        } catch (err) {
            throw new BadRequestError(err.message);
        }
    }

  
    @UseGuards(AccessTokenGuard)
    @Post('logout')
    async logout(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request
    ) {
        const userId = (req as any).user.userId;
        logger.info(`User ID from request: ${userId}`);
        logger.info(`Logging out userId: ${userId}`);
        const refreshToken = req.cookies['refreshToken'];
        if (refreshToken) {
            await this.authService.logout(userId);
        }
        return { message: 'Logout successfully' };
    }

    @ApiBearerAuth() 
    @ApiHeader({
        name: 'Authorization',
        description: 'Nhập Bearer <refresh_token> để lấy access token mới',
        required: true,
        example: 'Bearer your-refresh-token-here',
    })
    @Post('refresh-token')
    @UseGuards(RefreshTokenGuard)
    async handlerRefreshToken(
        @Res({ passthrough: true }) res: Response,
        @Req() req: Request,
    ) {
        const user = (req as any).user;
        const refreshToken = (req as any).refreshToken;
        if (!refreshToken) {
            throw new BadRequestException('Refresh token is required');
        }
        logger.info(`Received refresh token for userId: ${user.userId}, email: ${user.email}`);
        const result = await this.authService.handlerRefreshToken(
            refreshToken,
            user.userId,
            user.email,
        );
        return new SuccessResponse({
            message: 'Refresh token successfully',
            metadata: result,
        });
    }


}

