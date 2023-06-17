import { Application, Router } from "./deps.ts"
import Logger from "./modules/Logger.ts";
import BlogRoutes from "./routes/Blog.ts"

console.log(Deno.env.get('API_VERSION'))


class App {
    private APP: Application;
    private PORT: number;

    constructor() {
        this.PORT = 9999;
        this.APP = new Application();

        this.boot();
    }

    private setupRoutes(): void {
        this.APP.use(BlogRoutes.routes());
        this.APP.use(BlogRoutes.allowedMethods());
    }
    
    private boot(): void {
        this.setupRoutes();
        
        try {
            this.APP.listen({
                port: this.PORT,
            })
            Logger.info(`Application successfully up and running on port ${this.PORT}`)
        } catch (error) {
            Logger.error(`An error occured while setting up the application`, error     )
        }
    }
}

new App()
