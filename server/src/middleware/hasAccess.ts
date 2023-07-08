import { Request, Response, NextFunction } from 'express';
import Token from '../models/Token.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../modules/Config.js';
import Logger from '../modules/Logger.js';
import User from '../models/User.js';

export type accessRights = 'fullAccess' | 'readOnly';
export interface ExtendedPayload extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user: number;
}

// Middleware для проверки прав доступа к определенному endpoint-у
const hasAccess = (right: accessRights) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providedToken = req.headers.authorization?.split(' ')[1];

      if (!providedToken) {
        return res.status(403).json({
          error: {
            statusCode: 403,
            message: "Токен доступа не был предоставлен",
          },
        });
      }

      const verified = jwt.verify(providedToken, JWT_SECRET) as ExtendedPayload;
      if (!verified || typeof verified !== 'object') {
        return res.status(403).json({
          error: {
            statusCode: 403,
            message: 'Недействительный токен',
          },
        });
      }

      const admin = await User.findOne({
        where: {
          id: verified.id
        }
      });

      if(admin){
        next();
        return;
      }
      
      const storedToken = await Token.findOne({
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

      if (
        right === 'fullAccess' &&
        storedToken.dataValues.accessRights !== 'fullAccess'
      ) {
        return res.status(403).json({
          error: {
            statusCode: 403,
            message: "У вас нет необходимых прав для получения доступа к этой конечной точке",
          },
        });
      }
      next();
    } catch (error) {
      Logger.error(
        `Во время проверки вашего токена произошла ошибка, пожалуйста попробуйте еще раз: ${error}`
      );
      return res.status(500).json({
        error: {
          statusCode: 500,
          message: 'Возникла непредвиденная ошибка',
        },
      });
    }
  };
};

export default hasAccess;
