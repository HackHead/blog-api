import { Request, Response, NextFunction } from "express";
import Logger from "../modules/Logger.js";

const log = (req: Request, res: Response, next: NextFunction) => {
    Logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};

export default log;