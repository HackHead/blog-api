import { Sequelize } from 'sequelize';
import modifyLocalization from '../hooks/modifyLocalization.js';
import {
  POSTGRES_DATABASE_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '../modules/Config.js';
import Logger from '../modules/Logger.js';


// Настраиваем подключение к базе данных
const initializeSequelize = () => {
  try {
    // Берем данные для авторизации из конфига и создаем новый экземлпяр sequelize
    const sequelize = new Sequelize(
      `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE_NAME}`, {
        logging: false
      }
    );

    Logger.info('Соединение с базой данных успешно установлено');

    // Добавляем хук который будет преобразовывать локализацию из массива объектов в объект
    sequelize.addHook('afterFind', modifyLocalization);
    return sequelize;
  } catch (error) {
    Logger.info(`Возникла ошибка во время подключения к базе данных, ${error}`);
    throw error;
  }
};

export default initializeSequelize();
