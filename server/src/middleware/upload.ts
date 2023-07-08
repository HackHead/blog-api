import { Request, Response, NextFunction } from 'express';
import upload from '../modules/Storage.js';

interface CustomRequest extends Request {
  image: Express.Multer.File;
}

// Middleware который загружает изображение на сервер
const doUpload = (req: CustomRequest, res: Response, next: NextFunction) => {
  upload.single('thumbnail')(req, res, (error) => {
    if (error) {
      return res.status(400).send(error.message);
    }

    if (!req.file) {
      return res.status(400).send('Файлы не загружены');
    }

    req.image = req.file;
    next();
  });
};

export default doUpload;
