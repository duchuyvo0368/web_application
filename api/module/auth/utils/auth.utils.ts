import JWT from 'jsonwebtoken';
import { AuthFailureError, NotFoundError } from '../../../utils/error.response';
import { logger } from '../../../utils/logger';
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id',
};
import * as jwt from 'jsonwebtoken';
import { asyncHandler } from '../../helpers/asyncHandler';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import {  Socket } from 'socket.io';



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
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET); // sẽ throw nếu hết hạn
            console.log("Token verify:", decoded);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                logger.info("Token đã hết hạn");
            } else {
                logger.info("Token error:", err);
            }
        }

        //console.log('Decoded verify:', decoded);

        return {
            accessToken,
            refreshToken,
        };
    } catch (err) {
        console.error('JWT Error:', err);
        throw err;
    }
}


export function setupTokenExpirySocket(
    client: Socket,
    token: string,
    warningBeforeMs = 5000,
) {
    try {
        const decoded: any = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
        );

        if (!decoded.exp) {
            client.emit('token_invalid');
            return;
        }

        const now = Math.floor(Date.now() / 1000);
        const exp = decoded.exp;
        const timeLeft = (exp - now) * 1000;

        if (timeLeft > 0) {
            //canh bao
            if (timeLeft > warningBeforeMs) {
                setTimeout(() => {
                    client.emit('token_expiring');
                }, timeLeft - warningBeforeMs);
            }

            // hết hạn
            setTimeout(() => {
                client.emit('token_expired');
            }, timeLeft);
        } else {
            client.emit('token_expired');
        }
    } catch (err) {
        client.emit('token_invalid');
    }
}



