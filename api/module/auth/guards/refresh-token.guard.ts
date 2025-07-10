// src/auth/guards/refresh-token.guard.ts
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

        // const userId = req.headers[HEADER.CLIENT_ID] as string;
        let refreshToken = req.cookies?.['refreshToken'];
        if ( !refreshToken) {
            logger.warn('Missing refresh token or user ID');
            throw new AuthFailureError('Missing refresh token or user ID');
        }
        logger.info(`User ID from header: ${JWT_SECRET}`);
    
        if (refreshToken.startsWith('Bearer ')) {
            refreshToken = refreshToken.replace(/^Bearer\s/, '');
        }
        logger.info(`Verifying refresh token for: ${refreshToken}`);
        try {
           // logger.info(`Decoded refresh token: ${JSON.stringify(decoded)}`);
            const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
           
            // if (decoded.userId !== userId) {
            //     logger.warn(`Refresh token UserID mismatch: token=${decoded.userId}, header=${userId}`);
            //     throw new AuthFailureError('User ID mismatch');
            // }

            // Gắn thông tin user vào request
            (req as any).user = decoded;
            (req as any).refreshToken = refreshToken;

            return true;
        } catch (err) {
            logger.error(`Refresh Token Verification Failed: ${err.message}`);
            throw new AuthFailureError('Invalid Refresh Token');
        }
    }
}
  