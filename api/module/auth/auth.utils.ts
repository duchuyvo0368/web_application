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

const JWT_SECRET = process.env.JWT_SECRET || 'default';

export async function createTokenPair(payload: { userId: string; email: string }) {
    try {
        const accessToken = jwt.sign(payload, JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        const refreshToken = jwt.sign(payload, JWT_SECRET, {
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


// const authentication = asyncHandler(async (req, res, next) => {
//     const userId = req.headers[HEADER.CLIENT_ID] as string;
//     if (!userId) throw new AuthFailureError('Invalid Request');


//     // Handle Refresh Token
//     const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string;
//     if (refreshToken) {
//         try {
//             const decodeUser = JWT.verify(refreshToken, JWT_SECRET) as any;
//             if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');

//             req.user = decodeUser;
//             req.refreshToken = refreshToken;
//             return next();
//         } catch (e) {
//             logger.error('Verify RefreshToken Failed', e);
//             throw new AuthFailureError('Invalid Refresh Token');
//         }
//     }

//     // Handle Access Token
//     const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
//     if (!accessToken) throw new AuthFailureError('Missing Access Token');

//     try {
//         const decodeUser = JWT.verify(accessToken, JWT_SECRET) as any;
//         if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId');

//         req.user = decodeUser;
//         return next();
//     } catch (e) {
//         logger.error(`Verify AccessToken Failed ${e.message}`);
//         throw new AuthFailureError('Invalid Access Token');
//     }
// });


