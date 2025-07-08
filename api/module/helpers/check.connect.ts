import mongoose from 'mongoose';
import process from 'process';
import os from 'os';
import { Request, Response, NextFunction } from 'express';

const _SECONDS = 5000; // 5s

// Đếm số lượng kết nối MongoDB
export const countConnect = (): number => {
    const numConnections = mongoose.connections.length;
    console.log(`Connected to ${numConnections} database(s)`);
    return numConnections;
};

// Kiểm tra quá tải hệ thống (sử dụng như middleware)
export const checkOverload = (req: Request, res: Response, next: NextFunction): void => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length; // số lượng CPU
        const memoryUsage = process.memoryUsage().rss; // RAM sử dụng

        console.log(`🧠 Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)} MB`);
        console.log(`🔌 Number of active DB connections: ${numConnections}`);
        console.log(`🧩 CPU cores: ${numCores}`);

        // Giới hạn tối đa: mỗi core chỉ cho phép 5 kết nối DB
        const maxConnections = numCores * 5;
        if (numConnections >= maxConnections) {
            console.error('🚨 Overload: Reached maximum connections!');
            process.exit(1);
        }
    }, _SECONDS);

    next();
};

