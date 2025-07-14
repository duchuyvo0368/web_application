import * as fs from 'fs';
import * as multer from 'multer';
import * as path from 'path';

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads';
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + ext);
    },
});