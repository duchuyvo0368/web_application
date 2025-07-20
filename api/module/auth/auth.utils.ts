import JWT from 'jsonwebtoken';
import { AuthFailureError, NotFoundError } from '../../utils/error.response';
import { logger } from '../../utils/logger';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
};
import * as jwt from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandler';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';



export async function createTokenPair(payload: { userId: string; email: string }) {
    const JWT_SECRET = process.env.JWT_SECRET || 'default';
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh';
    logger.info(`Creating token pair for userId: ${payload.userId}, email: ${payload.email}`);
    logger.info(`JWT_SECRET: ${JWT_SECRET}`);
    try {
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
            algorithm: 'HS256',
            expiresIn: '7d',
        });

        // Tùy chọn: verify thử
        const decoded = jwt.verify(accessToken, JWT_SECRET);
        console.log('Decoded verify:', decoded);

        return {
            accessToken,
            refreshToken,
        };
    } catch (err) {
        console.error('JWT Error:', err);
        throw err;
    }
}


