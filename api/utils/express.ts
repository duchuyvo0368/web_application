// src/types/express/index.d.ts
import 'express';

declare module 'express' {
    interface Request {
        user?: {
            userId: string;
            email: string;
        };
        refreshToken?: string;
    }
}
