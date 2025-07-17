// // src/upload/upload.service.ts
// import { Injectable, BadRequestException } from '@nestjs/common';
// import { SuccessResponse } from '../../utils/success.response';
// import { logger } from '../../utils/logger';

// interface MulterS3File extends Express.Multer.File {
//     key?: string;
//     location?: string;
//     bucket?: string;
//     etag?: string;
// }

// @Injectable()
// export class UploadService {
//     private generateFileUrl(file: MulterS3File): string {
//         if (file.location) return file.location;
//         const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
//         return `${baseUrl}/uploads/${file.filename}`;
//     }

//     handleUpload(file: MulterS3File, userId: string, type: string) {
//         if (!file) throw new BadRequestException('No file uploaded');

//         logger.info(`User ${userId} uploaded ${type} image: ${file.originalname}`);
//         const fileUrl = this.generateFileUrl(file);

//         return new SuccessResponse({
//             message: `${type.charAt(0).toUpperCase() + type.slice(1)} image uploaded successfully`,
//             metadata: {
//                 url: fileUrl,
//                 key: file.key || file.filename,
//                 originalName: file.originalname,
//                 size: file.size,
//                 mimetype: file.mimetype,
//                 bucket: file.bucket || 'local',
//             },
//         });
//     }
// }
