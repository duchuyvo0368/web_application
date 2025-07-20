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
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise < boolean > {
        const request = context.switchToHttp().getRequest<AuthRequest>();
        const accessToken = request.headers['authorization']?.replace('Bearer ', '');
        const secret = process.env.JWT_SECRET || 'default';
        logger.info(`Access token: ${accessToken}`);
        if(!accessToken) throw new UnauthorizedException('No access token provided');

        try {
            const decoded: any = jwt.verify(accessToken, secret);
            request.user = decoded;
            return true;
        } catch(err) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }
}

