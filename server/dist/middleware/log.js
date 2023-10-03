import Logger from '../modules/Logger.js';
// Middleware который логирует запросы к нашему АПИ
const log = (req, res, next) => {
    Logger.info(`[${req.method}] ${req.originalUrl}`);
    next();
};
export default log;
