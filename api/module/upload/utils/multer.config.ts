import multerS3 from 'multer-s3';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
import path from 'path';
const AWS_BUCKET_NAME = 'trainning-buckets'
const AWS_ACCESS_KEY_ID = 'AKIA4SYAMJGBKAPOGSVN'
const AWS_SECRET_ACCESS_KEY = '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'
const AWS_REGION = 'us-east-1'
// Debug log for AWS env variables
// console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET');
// console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET');
// console.log('AWS_BUCKET_NAME:', process.env.AWS_BUCKET_NAME);
// console.log('AWS_REGION:', process.env.AWS_REGION);

if (!AWS_BUCKET_NAME) {
    throw new Error('[UPLOAD][FATAL] AWS_BUCKET_NAME is missing in environment variables. Please set it in your .env file.');
}

const s3 = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only images are allowed'));
};

export const uploadConfig = {
    storage: multerS3({
        s3,
        bucket: AWS_BUCKET_NAME!,
       // acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            const timestamp = Date.now();
            const ext = path.extname(file.originalname);
            const filename = `uploads/${timestamp}-${Math.random().toString(36).slice(2)}${ext}`;
            cb(null, filename);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter,
};
