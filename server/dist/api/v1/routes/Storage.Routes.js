var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Router } from 'express';
import log from '../../../middleware/log.js';
import uploader from '../../../modules/Storage.js';
import sharp from 'sharp';
import Thumbnail from '../../../models/Thumbnail.js';
import { APP_HOST, APP_PORT, NODE_ENV } from '../../../modules/Config.js';
const router = Router();
router.use(log);
router.post('/uploads', uploader.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const alt = req.body.alt;
        // Возвращаем ошибку если не был предоставлен альтернативный текст
        if (!alt) {
            return res.status(400).json({
                error: {
                    statusCode: 400,
                    message: 'У изображения всегда должен быть альтернативный текст'
                }
            });
        }
        else {
            // Генерируем url по которому будет находиться наше изображение
            const productionUrl = ((_a = req === null || req === void 0 ? void 0 : req.file) === null || _a === void 0 ? void 0 : _a.filename) ? `${APP_HOST}/uploads/${req.file.filename}` : null;
            ;
            const developmentUrl = ((_b = req === null || req === void 0 ? void 0 : req.file) === null || _b === void 0 ? void 0 : _b.filename) ? `${APP_HOST}:${APP_PORT}/uploads/${req.file.filename}` : null;
            ;
            const url = NODE_ENV === 'production' ? productionUrl : developmentUrl;
            // Получем разеры изображения
            const metadata = ((_c = req === null || req === void 0 ? void 0 : req.file) === null || _c === void 0 ? void 0 : _c.path) ? yield sharp(req.file.path).metadata() : { width: null, height: null }; // Extract image metadata using sharp
            const { width, height } = metadata;
            // Создаем новый instance
            const createdThumbnail = yield Thumbnail.create({
                url: url,
                width,
                height,
                alt
            });
            res.json({
                data: createdThumbnail
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            error: {
                statusCode: 400,
                message: 'Возникла непредвиденная ошибка, пожалустай попробуйте еще раз'
            }
        });
    }
}));
export default router;
