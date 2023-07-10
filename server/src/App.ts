import Logger from './modules/Logger.js';
import express, { Application, Router } from 'express';
import BlogRoutes from './api/v1/routes/Blog.Routes.js';
import AuthRoutes from './api/v1/routes/Auth.Routes.js';
import StorageRoutes from './api/v1/routes/Storage.Routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs'
import { APP_HOST, APP_PORT, NODE_ENV } from './modules/Config.js';

class App {
  private PORT: number;
  private APP: Application;

  constructor() {
    this.PORT = Number(APP_PORT) || 9999;
    this.APP = express();

    this.boot();
  }

  private setupRoutes(prefix: string, routes: Array<Router>): void {
    routes.map((route) => this.APP.use(prefix, route));
  }

  private setupCors() {
    this.APP.use(cors({ origin: '*' }));
  }

  private setupDocumentation() {
    const swaggerOptions = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'My API',
          version: '1.0.0',
          description: 'Описание вашего API',
        },
        servers: [
          {
            url: `${APP_HOST}:${APP_PORT}`, // Замените на ваш URL
          },
        ],
      },
      apis: ['./src/api/v1/routes/*.ts'], // Путь к вашим маршрутам API
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    this.APP.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }

  private setupBodyParser() {
    this.APP.use(bodyParser.urlencoded({ extended: true }));
    this.APP.use(bodyParser.json());
  }

  // Создаем эндпоинт для получения изображений
  private setupServeImages(){
    this.APP.get('/uploads/:filename', (req, res) => {
      const { filename } = req.params;
      const imagePath = path.join(path.resolve(), 'uploads', filename);
    
      if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
      } else {
        res.status(404).json({
          error: {
            statusCode: 404,
            message: 'Изображение не найдено'
          }
        });
      }
    });
  }
  
  // Запускаем приложение
  private async boot(): Promise<void> {
    try {
      this.setupBodyParser();
      this.setupDocumentation();
      this.setupCors();

      this.setupServeImages();
      this.setupRoutes('/api/v1', [BlogRoutes, AuthRoutes, StorageRoutes]);

      this.APP.listen(this.PORT, () => {
        Logger.info(
          `Ваше приложение успешно запущено и работает на порту ${this.PORT}`
        );
      });
    } catch (error) {
      Logger.error('Возникла ошибка во время запуска вашего приложения');
      Logger.error(error);
    }
  }
}

new App();
