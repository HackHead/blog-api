import Logger from './modules/Logger.js';
import express, { Application, Router } from 'express';
import BlogRoutes from './api/v1/routes/Blog.Routes.js';
import AuthRoutes from './api/v1/routes/Auth.Routes.js';
import bodyParser from 'body-parser';
import { log } from 'console';
import cors from 'cors';

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

  private setupMiddleware() {
    this.APP.use(log);
  }

  private setupBodyParser() {
    this.APP.use(bodyParser.urlencoded({ extended: true }));
    this.APP.use(bodyParser.json());
  }

  private async boot(): Promise<void> {
    try {
      this.setupBodyParser();
      // this.setupMiddleware();
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
