import { Router } from 'express';
import log from '../../../middleware/log.js';
import uploader from '../../../modules/Storage.js';
import sharp from 'sharp';
import Thumbnail from '../../../models/Thumbnail.js';
import { APP_HOST, APP_PORT, MODE, NODE_ENV} from '../../../modules/Config.js';

const router = Router();

router.use(log);

router.post('/uploads', uploader.single('file'),async (req, res) => {
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
    } else {  

      // Генерируем url по которому будет находиться наше изображение
      const productionUrl = req?.file?.filename ? `${APP_HOST}/uploads/${req.file.filename}` : null;;
      const developmentUrl = req?.file?.filename ? `${APP_HOST}:${APP_PORT}/uploads/${req.file.filename}` : null;;
      const url = NODE_ENV === 'production' ? productionUrl : developmentUrl;

      // Получем разеры изображения
      const metadata = req?.file?.path ? await sharp(req.file.path).metadata() : {width: null, height: null}; // Extract image metadata using sharp

      const { width, height  } = metadata;
  
      // Создаем новый instance
      const createdThumbnail = await Thumbnail.create({
        url: url,
        width,
        height,
        alt
      })
      
      res.json({
        data: createdThumbnail
      });
    }

    
  } catch (error) {
    return res.status(400).json({
      error: {
        statusCode: 400,
        message: 'Возникла непредвиденная ошибка, пожалустай попробуйте еще раз'
      }
    });
  }
});


export default router;
