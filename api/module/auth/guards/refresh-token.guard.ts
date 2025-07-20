import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { logger } from 'utils/logger';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const refreshToken = request.cookies['refreshToken'] || request.headers['x-refresh-token'];

        const secret = process.env.JWT_REFRESH_SECRET || 'default';
        if (!refreshToken) throw new UnauthorizedException('No refresh token provided');

        try {
            const decoded: any = jwt.verify(refreshToken, secret);
            request.user = decoded;
            request.refreshToken = refreshToken;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }
}
