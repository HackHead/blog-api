var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { genSalt, hash, compare } from 'bcrypt';
import Logger from '../../../modules/Logger.js';
import isValidTokenBody from '../../../validations/isValidTokenBody.js';
import Token from '../../../models/Token.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../../modules/Config.js';
import User from '../../../models/User.js';
import isValidUserRegBody from '../../../validations/isValidUserRegBody.js';
export default class AuthController {
    static me(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // Получаем из headers токен пользователя
            const providedToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
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
                const user = yield User.findOne({
                    where: {
                        id: verified.id
                    }
                });
                if (user) {
                    return res.json({
                        data: {
                            id: user.dataValues.id,
                            email: user.dataValues.email,
                            first_name: user.dataValues.first_name,
                            last_name: user.dataValues.last_name,
                            full_name: user.dataValues.full_name,
                        }
                    });
                }
                return res.json({
                    data: null
                });
            }
            catch (error) {
                return res.status(500).json({
                    error: {
                        statusCode: 400,
                        message: 'Непредвиденная ошибка'
                    }
                });
            }
        });
    }
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                if (!email) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Неправильный email'
                        }
                    });
                }
                if (!password) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Неправильный пароль'
                        }
                    });
                }
                const userExists = yield User.findOne({
                    where: {
                        email
                    }
                });
                if (!userExists) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Пользователь с таким почтовым адресом не существует'
                        }
                    });
                }
                const isValidPassword = yield compare(password, userExists.dataValues.password);
                if (!isValidPassword) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Неправильный пароль'
                        }
                    });
                }
                const token = jwt.sign({ id: userExists.dataValues.id }, JWT_SECRET);
                res.cookie('anotherCookie', 'anotherValue', { maxAge: 900000, httpOnly: true });
                res.json({
                    data: {
                        token,
                        user: userExists
                    }
                });
            }
            catch (error) {
                return res.status(500).json({
                    error: {
                        statusCode: 400,
                        message: 'Непредвиденная ошибка'
                    }
                });
            }
        });
    }
    static logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    static deleteToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const tokenExists = yield Token.findOne({
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
                }
                else {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Токен не сущестует',
                        },
                    });
                }
            }
            catch (error) {
                Logger.error(`Во время удаления токена произошла ошибка: ${error}`);
                return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
            }
        });
    }
    static createToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value: data, error } = isValidTokenBody(req.body);
                if (error) {
                    return res.status(400).json({ error });
                }
                const { expirationDate, name, description, accessRights } = data;
                const token = crypto.randomBytes(32).toString('hex');
                const createdToken = yield Token.create({
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
            }
            catch (error) {
                Logger.error(`Возникла ошибка во время создания токена: ${error}`);
                return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
            }
        });
    }
    static getTokens(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokens = yield Token.findAll({
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
            }
            catch (error) {
                Logger.error(`Возникла ошибка при попытке получить токен: ${error}`);
                return res.status(500).json({ error: 'Возникла непредвиденная ошибка' });
            }
        });
    }
    static createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value: data, error } = isValidUserRegBody(req.body);
                if (error) {
                    return res.status(400).json({ error });
                }
                const { first_name, last_name, email, password } = data;
                const full_name = `${first_name} ${last_name}`;
                const userExists = yield User.findOne({
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
                const salt = yield genSalt(10);
                const hashedPassword = yield hash(password, salt);
                const createdUser = yield User.create({
                    email,
                    password: hashedPassword,
                    first_name,
                    last_name,
                    full_name,
                });
                const _a = createdUser.dataValues, { password: excludedPassword } = _a, publicData = __rest(_a, ["password"]);
                return res.json({
                    data: Object.assign({}, publicData),
                });
            }
            catch (error) {
                Logger.error(error);
                return res.status(500).json({
                    error: {
                        statusCode: 500,
                        message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
                    },
                });
            }
        });
    }
}
