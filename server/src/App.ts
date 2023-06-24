import Logger from './modules/Logger.js';
import express, { Application, Router } from 'express';
import BlogRoutes from './api/v1/routes/Blog.Routes.js';
import AuthRoutes from './api/v1/routes/Auth.Routes.js';
import bodyParser from 'body-parser';
import { log } from 'console';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

class App {
  private PORT: number;
  private APP: Application;

  constructor() {
    this.PORT = 9999;
    this.APP = express();

    this.boot();
  }

  private setupRoutes(prefix: string, routes: Array<Router>): void {
    routes.map((route) => this.APP.use(prefix, route));
  }

  private setupCors() {
    this.APP.use(cors({ origin: '*' }));
  }

  private setupDocumentation(){
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
            url: 'http://localhost:9999', // Замените на ваш URL
          },
        ],
      },
      apis: ['./src/api/v1/routes/*.ts'], // Путь к вашим маршрутам API
    };

    const swaggerSpec = swaggerJSDoc(swaggerOptions);

    this.APP.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  }
  
  private setupMiddleware() {
    this.APP.use(log);
  }

  private setupBodyParser() {
    this.APP.use(bodyParser.urlencoded({ extended: true }));
    this.APP.use(bodyParser.json());
  }

  private async boot(): Promise<void> {
    try {
      // this.setupMiddleware();
      this.setupBodyParser();
      this.setupDocumentation()
      this.setupCors();
      this.setupRoutes('/api/v1', [BlogRoutes, AuthRoutes]);

      this.APP.listen(this.PORT, () => {
        Logger.info(
          `Your application succesffully up and running on port ${this.PORT}`
        );
      });
    } catch (error) {
      Logger.error('An error occured while setting up your application');
    }
  }
}

new App();
