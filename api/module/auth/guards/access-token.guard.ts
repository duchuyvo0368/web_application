// guards/access-token.guard.ts
import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { AuthFailureError } from '../../../utils/error.response';
import { logger } from '../../../utils/logger';

const HEADER = {
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
};

const JWT_SECRET = process.env.JWT_SECRET || 'default';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const userId = req.headers[HEADER.CLIENT_ID] as string;
        const authHeader = req.headers[HEADER.AUTHORIZATION] as string;

        if (!authHeader) {
            logger.warn('Missing credentials');
            throw new AuthFailureError('Missing credentials');
        }


        const [scheme, token] = authHeader.split(' ');

        if (scheme !== 'Bearer' || !token) {
            logger.warn('Invalid Authorization format');
            throw new AuthFailureError('Invalid Authorization format');
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            // if (decoded.userId !== userId) {
            //     logger.warn(`UserID mismatch: token=${decoded.userId}, header=${userId}`);
            //     throw new AuthFailureError('User ID mismatch');
            // }
            logger.info(`Access Token verified for user: ${decoded.userId}`);
            (req as any).user = decoded;
            return true;
        } catch (err) {
            logger.error(`Access Token Verification Failed: ${err.message}`);
            throw new AuthFailureError('Invalid Access Token');
        }
    }
}
