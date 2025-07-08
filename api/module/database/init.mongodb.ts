'use strict';

import mongoose from 'mongoose';
import { countConnect } from '../helpers/check.connect';
import config from './config';

const {
    db: { host, port, name },
    options
} = config;

const connectString = `mongodb://${host}:${port}/${name}`;
console.log('ConnectString: ' + connectString);

export class Database {
    private static instance: Database;

    private constructor() {
        this.connect();
    }

    private connect(): void {
        mongoose.set('debug', true);
        mongoose.connect(connectString, options)
            .then(() => {
                console.log('MongoDB connected successfully');
            })
            .catch((err) => {
                console.error('Failed to connect to MongoDB:', err);
                process.exit(1);
            });
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

// Tạo instance singleton để dùng ở nơi khác
export const instanceMongodb = Database.getInstance();
