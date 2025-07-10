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

const JWT_SECRET = process.env.JWT_SECRET || 'default';

@Injectable()
export class AccessTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest<Request>();

        const token = req.cookies.accessToken; 
        logger.info(`Access Token: ${token}`);
        if (!token) {
            logger.warn('Missing credentials');
            throw new AuthFailureError('Missing credentials');
        }

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;

            logger.info(`Access Token verified for user: ${decoded.userId}`);
            (req as any).user = decoded;
            return true;
        } catch (err: any) {
            logger.error(`Access Token Verification Failed: ${err.message}`);
            throw new AuthFailureError('Invalid Access Token');
        }
    }
}
  