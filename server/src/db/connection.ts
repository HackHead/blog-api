import { Sequelize } from 'sequelize';
import {
  POSTGRES_DATABASE_NAME,
  POSTGRES_HOST,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_USER,
} from '../modules/Config.js';
import Logger from '../modules/Logger.js';

const initializeSequelize = () => {
  try {
    const sequelize = new Sequelize(
      `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DATABASE_NAME}`
    );

    Logger.info('Database connection successfully established');

    return sequelize;
  } catch (error) {
    Logger.info(`An error occured while connection to the database, ${error}`);
    throw error;
  }
};

export default initializeSequelize();
