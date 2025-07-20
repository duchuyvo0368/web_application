import { pick } from 'lodash';
import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger'; // chỉnh lại đường dẫn logger cho đúng
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';


// Lấy thông tin từ object theo field được chọn
export const getInfoData = ({
    fields = [],
    objects = {},
}: {
    fields: string[];
    objects: Record<string, any>;
}): Record<string, any> => {
    return pick(objects, fields);
};

// Chuyển array field => object { field: 1 }
export const getSelectData = ({
    select = [],
}: {
    select: string[];
}): Record<string, 1> => {
    return Object.fromEntries(select.map((el) => [el, 1]));
};

// Chuyển array field => object { field: 0 }
export const unGetSelectData = ({
    unSelect = [],
}: {
    unSelect: string[];
}): Record<string, 0> => {
    return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

// Xóa các key có giá trị undefined
export const removeUnderfinedObject = (obj: Record<string, any>): Record<string, any> => {
    Object.keys(obj).forEach((key) => {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    });
    return obj;
};

// Chuyển object lồng nhau thành object dạng flat dùng cho updateOne
export const updateNestedObjectPaser = (obj: Record<string, any>): Record<string, any> => {
    const final: Record<string, any> = {};

    Object.keys(obj).forEach((key) => {
        if (
            typeof obj[key] === 'object' &&
            obj[key] !== null &&
            !Array.isArray(obj[key])
        ) {
            const nested = updateNestedObjectPaser(obj[key]);
            Object.keys(nested).forEach((nestedKey) => {
                final[`${key}.${nestedKey}`] = nested[nestedKey];
            });
        } else {
            final[key] = obj[key];
        }
    });

    return final;
};

// Chuyển string ID => mongoose ObjectId
export const convertToObject = (id: string): mongoose.Types.ObjectId => {
    return new mongoose.Types.ObjectId(id);
};



@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException
                ? exception.getResponse()
                : exception.message;

        logger.error(
            `[${request.method}] ${request.url}: ${JSON.stringify(message)}`,
        );

        response.status(status).json({
            status: 'error',
            code: status,
            message: typeof message === 'string' ? message : message['message'],
        });
    }
}
const meFields = ['_id', 'name', 'email', 'bio', 'avatar', 'phone', 'birthday'];
const friendFields = ['_id', 'name', 'email', 'bio', 'avatar'];
const strangerFields = ['_id', 'name', 'avatar'];

export function filterFields<T extends object>(obj: T, fields: string[]): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([key]) => fields.includes(key))
    ) as Partial<T>;
}