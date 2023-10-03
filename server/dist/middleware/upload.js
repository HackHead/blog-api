import upload from '../modules/Storage.js';
// Middleware который загружает изображение на сервер
const doUpload = (req, res, next) => {
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
