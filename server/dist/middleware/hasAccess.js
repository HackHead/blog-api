var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Token from '../models/Token.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../modules/Config.js';
import Logger from '../modules/Logger.js';
import User from '../models/User.js';
// Middleware для проверки прав доступа к определенному endpoint-у
const hasAccess = (right) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const providedToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
            if (!providedToken) {
                return res.status(403).json({
                    error: {
                        statusCode: 403,
                        message: "Токен доступа не был предоставлен",
                    },
                });
            }
            const verified = jwt.verify(providedToken, JWT_SECRET);
            if (!verified || typeof verified !== 'object') {
                return res.status(403).json({
                    error: {
                        statusCode: 403,
                        message: 'Недействительный токен',
                    },
                });
            }
            const admin = yield User.findOne({
                where: {
                    id: verified.id
                }
            });
            if (admin) {
                next();
                return;
            }
            const storedToken = yield Token.findOne({
                where: {
                    id: verified.id,
                },
            });
            if (!storedToken) {
                return res.status(403).json({
                    error: {
                        statusCode: 403,
                        message: 'У вас нет необходимых прав для получения доступа к этой конечной точке',
                    },
                });
            }
            if (right === 'fullAccess' &&
                storedToken.dataValues.accessRights !== 'fullAccess') {
                return res.status(403).json({
                    error: {
                        statusCode: 403,
                        message: "У вас нет необходимых прав для получения доступа к этой конечной точке",
                    },
                });
            }
            next();
        }
        catch (error) {
            Logger.error(`Во время проверки вашего токена произошла ошибка, пожалуйста попробуйте еще раз: ${error}`);
            return res.status(500).json({
                error: {
                    statusCode: 500,
                    message: 'Возникла непредвиденная ошибка',
                },
            });
        }
    });
};
export default hasAccess;
