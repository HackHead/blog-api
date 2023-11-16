import Thumbnail from '../dist/models/Thumbnail.js';
import { Op } from 'sequelize';

const update = async () => {
    try {
        console.log('Поиск изображений.');
        
        const images = await Thumbnail.findAll({
            where: {
                url: {
                    [Op.startsWith]: 'http:',
                },
            },
        });

        console.log('Обновление...')
        
        images.forEach(async (image) => {
            image.dataValues.url = image.dataValues.url.replace(/^http:\/\//, 'https://');
            await image.save(); 
        });

        console.log('Обновление успешно завершено.');
    } catch (error) {
        console.error('Ошибка при обновлении изображений:', error);
    }
}



update();