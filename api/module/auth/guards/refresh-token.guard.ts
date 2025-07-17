import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthFailureError } from '../../../utils/error.response';
import { logger } from '../../../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'default';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const authHeader = req.headers['authorization'];
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            logger.warn('Missing or malformed Authorization header');
            throw new AuthFailureError('Missing or malformed refresh token');
        }

        const refreshToken = authHeader.replace(/^Bearer\s/, '').trim();
        logger.info(`Verifying refresh token...`);

        try {
            const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;

            // Gắn user và refresh token vào request để sử dụng sau
            (req as any).user = decoded;
            (req as any).refreshToken = refreshToken;

            logger.info(`Refresh token verified. UserID: ${decoded.sub}`);
            return true;
        } catch (err) {
            logger.error(`Refresh Token Verification Failed: ${err.message}`);
            throw new AuthFailureError('Invalid or expired refresh token');
        }
    }
}
