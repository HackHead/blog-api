import { Request, Response, NextFunction } from 'express';
import Token from '../models/Token.js';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from '../modules/Config.js';
import Logger from '../modules/Logger.js';

export type accessRights = 'fullAccess' | 'readOnly';
export interface ExtendedPayload extends JwtPayload {
  id: string;
}

const hasAccess = (right: accessRights) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const providedToken = req.headers.authorization?.split(' ')[1];

      if (!providedToken) {
        return res.status(403).json({
          error: {
            statusCode: 403,
            message: "Access token wasn't provided",
          },
        });
      }

      const verified = jwt.verify(providedToken, JWT_SECRET);
      if (!verified || typeof verified !== 'object') {
        return res.status(403).json({
          error: {
            statusCode: 403,
            message: 'Invalid token provided',
          },
        });
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
            message: 'Invalid token provided',
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
            message: "You don't have access to this route",
          },
        });
      }
      next();
    } catch (error) {
      Logger.error(
        `An unexpected error occured while validating the token, please try again: ${error}`
      );
      return res.status(500).json({
        error: {
          statusCode: 500,
          message: 'An unexpected error occured, please try again',
        },
      });
    }
  };
};

export default hasAccess;
