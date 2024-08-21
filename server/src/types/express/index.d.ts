import { MulterFile } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile;
    }
  }
}