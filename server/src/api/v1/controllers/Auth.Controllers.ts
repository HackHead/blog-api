import { genSalt, hash, compare } from 'bcrypt';
import { Request, Response } from 'express';
import Logger from '../../../modules/Logger.js';
import isValidTokenBody from '../../../validations/isValidTokenBody.js';
import Token from '../../../models/Token.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../modules/Config.js';
import User from '../../../models/User.js';
import isValidUserRegBody from '../../../validations/isValidUserRegBody.js';
import { AuthenticatedRequest } from '../../../middleware/hasAccess.js';

export default class AuthController {
  public static async me(req: Request, res: Response) {
    // Получаем из headers токен пользователя
    const providedToken = req.headers.authorization?.split(' ')[1];


    // Если у пользователля нету токена отправляем ошибку 403
    if (!providedToken) {
      return res.status(403).json({
        error: {
          statusCode: 403,
          message: "Токен не был предоставлен",
        },
      });
    }


    const verified = jwt.verify(providedToken, JWT_SECRET);
    
    // Если токен не верицифирован то так же отправляем ошибку 403
    if (!verified || typeof verified !== 'object') {
      return res.status(403).json({
        error: {
          statusCode: 403,
          message: 'Недействительный токен',
        },
      });
    }

    try {
      // Ищем пользователя по id который мы получили из токена и отправляем на клиент
      const user = await User.findOne({
        where: {
          id: verified.id
        }
      })
      
      if(user){
        return res.json({
          data: {
            id: user.dataValues.id,
            email: user.dataValues.email,
            first_name: user.dataValues.first_name,
            last_name: user.dataValues.last_name,
            full_name: user.dataValues.full_name,
          }
        })
      }

      return res.json({
        data: null
      })

    } catch (error) {
      return res.status(500).json({
        error: {
          statusCode: 400,
          message: 'Непредвиденная ошибка'
        }
      })
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const {
        email, password
      } = req.body;
  
      if(!email){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Неправильный email'
          }
        })
      }
  
      if(!password){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Неправильный пароль'
          }
        })
      }
  
      const userExists = await User.findOne({
        where: {
          email
        }
      })
  
      if(!userExists){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Пользователь с таким почтовым адресом не существует'
          }
        })
      }
  
      const isValidPassword = await compare(password, userExists.dataValues.password);
  
      
      if(!isValidPassword){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Неправильный пароль'
          }
        })
      }
  
      const token = jwt.sign({id: userExists.dataValues.id}, JWT_SECRET);
      
      res.cookie('anotherCookie', 'anotherValue', { maxAge: 900000, httpOnly: true });
      res.json({
        data: {
          token,
          user: userExists
        }
      })
      
    
    } catch (error) {
      return res.status(500).json({
        error: {
          statusCode: 400,
          message: 'Непредвиденная ошибка'
        }
      })
    }
  }

  public static async logout(req: Request, res: Response) {
    
  }


  public static async deleteToken(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const tokenExists = await Token.findOne({
        where: {
          id,
        },
        attributes: [
          'id',
          'description',
          'expirationDate',
          'name',
          'accessRights',
          'createdAt',
          'updatedAt',
        ],
      });

      if (tokenExists) {
        tokenExists.destroy();

        return res.json({
          data: tokenExists,
          meta: {
            message: 'Токен успешно удален',
          },
        });
      } else {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Токен не сущестует',
          },
        });
      }
    } catch (error) {
      Logger.error(`Во время удаления токена произошла ошибка: ${error}`);
      return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
    }
  }

  public static async createToken(req: Request, res: Response) {
    try {
      const { value: data, error } = isValidTokenBody(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const { expirationDate, name, description, accessRights } = data;

      const token = crypto.randomBytes(32).toString('hex');

      const createdToken = await Token.create({
        token,
        expirationDate,
        name,
        description,
        accessRights,
      });

      const enc = jwt.sign({ id: createdToken.dataValues.id }, JWT_SECRET);
      Logger.info(`Токен успешно создан`);

      return res.json({
        data: {
          token: enc,
        },
      });
    } catch (error) {
      Logger.error(`Возникла ошибка во время создания токена: ${error}`);
      return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
    }
  }

  public static async getTokens(req: Request, res: Response) {
    try {
      const tokens = await Token.findAll({
        attributes: [
          'id',
          'description',
          'expirationDate',
          'name',
          'accessRights',
          'createdAt',
        ],
      });

      return res.json({
        data: tokens,
        meta: {},
      });
    } catch (error) {
      Logger.error(`Возникла ошибка при попытке получить токен: ${error}`);
      return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
    }
  }

  public static async createUser(req: Request, res: Response) {
    try {
      const { value: data, error } = isValidUserRegBody(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const { first_name, last_name, email, password } = data;

      const full_name = `${first_name} ${last_name}`;

      const userExists = await User.findOne({
        where: { email },
      });

      if (userExists) {
        return res.status(409).json({
          error: {
            statusCode: 409,
            message: `Пользователь ${email} уже существует, пожалуйста выберите другой адрес`,
          },
        });
      }

      const salt = await genSalt(10);
      const hashedPassword = await hash(password, salt);

      const createdUser = await User.create({
        email,
        password: hashedPassword,
        first_name,
        last_name,
        full_name,
      });

      const { password: excludedPassword, ...publicData } =
        createdUser.dataValues;

      return res.json({
        data: {
          ...publicData,
        },
      });
    } catch (error) {
      Logger.error(error);

      return res.status(500).json({
        error: {
          statusCode: 500,
          message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
        },
      });
    }
  }
}
