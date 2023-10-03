import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.resolve(), 'uploads'));
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.').pop();
        const filename = `${uuidv4()}.${ext}`;
        cb(null, filename);
    },
});
const upload = multer({ storage: storage });
export default upload;
