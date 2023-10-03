var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Logger from './modules/Logger.js';
import express from 'express';
import BlogRoutes from './api/v1/routes/Blog.Routes.js';
import AuthRoutes from './api/v1/routes/Auth.Routes.js';
import StorageRoutes from './api/v1/routes/Storage.Routes.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import fs from 'fs';
import { APP_HOST, APP_PORT } from './modules/Config.js';
class App {
    constructor() {
        this.PORT = Number(APP_PORT) || 9999;
        this.APP = express();
        this.boot();
    }
    setupRoutes(prefix, routes) {
        routes.map((route) => this.APP.use(prefix, route));
    }
    setupCors() {
        this.APP.use(cors({ origin: '*' }));
    }
    setupDocumentation() {
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
    setupBodyParser() {
        this.APP.use(bodyParser.urlencoded({ extended: true }));
        this.APP.use(bodyParser.json());
    }
    // Создаем эндпоинт для получения изображений
    setupServeImages() {
        this.APP.get('/uploads/:filename', (req, res) => {
            const { filename } = req.params;
            const imagePath = path.join(path.resolve(), 'uploads', filename);
            if (fs.existsSync(imagePath)) {
                res.sendFile(imagePath);
            }
            else {
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
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.setupBodyParser();
                this.setupDocumentation();
                this.setupCors();
                this.setupServeImages();
                this.setupRoutes('/api/v1', [BlogRoutes, AuthRoutes, StorageRoutes]);
                this.APP.listen(this.PORT, () => {
                    console.log(new Date());
                    Logger.info(`Ваше приложение успешно запущено и работает на порту ${this.PORT}`);
                });
            }
            catch (error) {
                Logger.error('Возникла ошибка во время запуска вашего приложения');
                Logger.error(error);
            }
        });
    }
}
new App();
