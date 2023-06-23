import bcrypt, { genSalt, hash } from 'bcrypt';
import { Request, Response } from 'express';
import Logger from '../../../modules/Logger.js';
import isValidTokenBody from '../../../validations/isValidTokenBody.js';
import Token from '../../../models/Token.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../modules/Config.js';
import User from '../../../models/User.js';
import isValidUserRegBody from '../../../validations/isValidUserRegBody.js';

export default class AuthController {
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
            message: 'Token successfully destroyed',
          },
        });
      } else {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Token does not exist',
          },
        });
      }
    } catch (error) {
      console.log(error);
      Logger.error(`An error occured while creating a token: ${error}`);
      return res.status(400).json({ error: 'Unexpected error occured' });
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
      Logger.info(`Token successfully created`);

      return res.json({
        data: {
          token: enc,
        },
      });
    } catch (error) {
      Logger.error(`An error occured while creating a token: ${error}`);
      return res.status(400).json({ error: 'Unexpected error occured' });
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
      Logger.error(`An error occured while getting list of tokens: ${error}`);
      return res.status(400).json({ error: 'Unexpected error occured' });
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
            message: `User ${email} already exists, please choose another email`,
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
          message: 'Server error occured, please try again later',
        },
      });
    }
  }
}
