var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { validate as uuidValidate } from 'uuid';
import { Op } from 'sequelize';
import isValidCategoryLoc from '../../../validations/isValidCategoryLocalization.js';
import isValidCategoryBody from '../../../validations/isValidCategoryBody.js';
import Category from '../../../models/Category.js';
import Logger from '../../../modules/Logger.js';
import CategoryTranslation from '../../../models/CategoryTranslation.js';
import Article from '../../../models/Article.js';
import User from '../../../models/User.js';
import Language from '../../../models/Language.js';
import isValidArticleLoc from '../../../validations/isValidArticleLocalization.js';
import slugify from '@sindresorhus/slugify';
import ArticleTranslation from '../../../models/ArticleTranslation.js';
import isValidQueryParams from '../../../validations/isValidQueryParams.js';
import val from 'validator';
import isValidUUIDArray from '../../../validations/isValidUUIDArray.js';
import Domain from '../../../models/Domain.js';
import Joi from 'joi';
import Thumbnail from '../../../models/Thumbnail.js';
const validator = val.default;
export default class BlogControllers {
    static updateThumbnail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { alt } = req.body;
                const schema = Joi.object({
                    alt: Joi.string().required().min(2)
                });
                const { error } = schema.validate({
                    alt
                });
                if (error) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: error.details[0].message
                        }
                    });
                }
                const thumnailExists = yield Thumbnail.findOne({
                    where: {
                        id
                    }
                });
                if (!thumnailExists) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Такой миниатюры не существует',
                        },
                    });
                }
                yield Thumbnail.update({
                    alt,
                }, {
                    where: {
                        id
                    }
                });
                return res.json({
                    data: thumnailExists,
                    meta: {}
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    error: {
                        statusCode: 500,
                        message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
                    },
                });
            }
        });
    }
    static getLanguages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const langauges = yield Language.findAll();
                return res.json({
                    data: langauges,
                });
            }
            catch (error) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
                    },
                });
            }
        });
    }
    static updateDomain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!validator.isUUID(id, 4)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Недействительный id',
                    },
                });
            }
            const domainExists = yield Domain.findOne({
                where: {
                    id,
                }
            });
            if (!domainExists) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Домена с таким ID не существует',
                    },
                });
            }
            const { ip_address, url } = req.body;
            const schema = Joi.object({
                ip_address: Joi.string().ip().optional(),
                url: Joi.string().optional().uri(),
            });
            const { error, value } = schema.validate({ ip_address, url });
            if (error) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: error.details[0].message,
                    }
                });
            }
            const updatedDomain = yield Domain.update(Object.assign({}, req.body), {
                where: {
                    id,
                },
                returning: true,
            });
            return res.json({
                domain: updatedDomain,
            });
        });
    }
    static getArticleById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lang, limit, page } = isValidQueryParams(req.query);
                const { id } = req.params;
                if (!validator.isUUID(id, 4)) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Недействительный id',
                        },
                    });
                }
                const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
                const article = yield Article.findOne({
                    where: {
                        id,
                    },
                    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['first_name', 'last_name', 'full_name', 'email'],
                        },
                        {
                            model: Thumbnail,
                            as: 'thumbnail',
                            duplicating: true,
                        },
                        {
                            model: Domain,
                            as: 'domain',
                        },
                        {
                            model: Category,
                            as: 'category',
                            attributes: ['id', 'name'],
                            include: [
                                {
                                    model: CategoryTranslation,
                                    as: 'localization',
                                    attributes: ['id', 'name'],
                                    include: [
                                        Object.assign({ model: Language, as: 'language', attributes: ['id', 'code', 'name'] }, langCondition),
                                    ],
                                },
                            ],
                        },
                        {
                            model: ArticleTranslation,
                            as: 'localization',
                            include: [
                                Object.assign({ model: Language, as: 'language' }, langCondition),
                            ],
                        },
                    ],
                    limit: limit,
                    offset: (page - 1) * limit,
                });
                return res.json({
                    data: article,
                    meta: {},
                });
            }
            catch (error) {
                console.log(error);
                Logger.error(error);
                return res.status(500).json({ error });
            }
        });
    }
    static getDomains(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const domains = yield Domain.findAll();
                return res.json({
                    data: domains,
                });
            }
            catch (error) {
                console.log(error);
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
                    },
                });
            }
        });
    }
    static deleteArticleTranslation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!uuidValidate(id)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Недействительный id',
                    },
                });
            }
            const deletedArticle = yield ArticleTranslation.destroy({
                where: {
                    id,
                },
            });
            return res.json({
                data: deletedArticle,
                meta: {},
            });
        });
    }
    static deleteCategoryTranslation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.query;
            if (typeof ids === 'string' && !isValidUUIDArray(ids === null || ids === void 0 ? void 0 : ids.split(','))) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Массив идентификатор недействителен',
                    },
                });
            }
            const deletedTranslation = yield CategoryTranslation.destroy({
                where: {
                    id: ids,
                },
            });
            return res.json({
                data: deletedTranslation,
                meta: {},
            });
        });
    }
    static deleteArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!uuidValidate(id)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Недействительный id',
                    },
                });
            }
            const deletedArticle = yield Article.destroy({
                where: {
                    id,
                },
            });
            return res.json({
                data: deletedArticle,
                meta: {},
            });
        });
    }
    static deleteArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.query;
            if (typeof ids === 'string' && !isValidUUIDArray(ids === null || ids === void 0 ? void 0 : ids.split(','))) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Invalid array of uuids provded',
                    },
                });
            }
            const deletedArticles = yield Article.destroy({
                where: {
                    id: ids,
                },
            });
            return res.json({
                data: deletedArticles,
                meta: {},
            });
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!uuidValidate(id)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Invalid id provided',
                    },
                });
            }
            const deletedCategory = yield Category.destroy({
                where: {
                    id,
                },
            });
            return res.json({
                data: deletedCategory,
                meta: {},
            });
        });
    }
    static deleteDomain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!uuidValidate(id)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Invalid id provided',
                    },
                });
            }
            const deletedDomain = yield Domain.destroy({
                where: {
                    id,
                },
            });
            return res.json({
                data: deletedDomain,
                meta: {},
            });
        });
    }
    static deleteCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ids } = req.query;
            if (typeof ids === 'string' && !isValidUUIDArray(ids === null || ids === void 0 ? void 0 : ids.split(','))) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Invalid array of uuids provded',
                    },
                });
            }
            const deletedCategories = yield Category.destroy({
                where: {
                    id: ids,
                },
            });
            return res.json({
                data: deletedCategories,
                meta: {},
            });
        });
    }
    static getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lang, limit, page, categories, domain, dateFrom = new Date('1971-01-01'), dateTo = new Date() } = isValidQueryParams(req.query);
                const pubDateCondition = {
                    where: {
                        pub_date: {
                            [Op.between]: [dateFrom, dateTo]
                        }
                    }
                };
                const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
                const categoriesCondition = categories
                    ? { where: { id: { [Op.in]: categories } } }
                    : {};
                const domainCondition = domain ? { where: { url: domain } } : {};
                const articles = yield Article.findAll({
                    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: User,
                            as: 'author',
                            attributes: ['first_name', 'last_name', 'full_name', 'email'],
                            duplicating: true,
                        },
                        {
                            model: Thumbnail,
                            as: 'thumbnail',
                            duplicating: true,
                        },
                        Object.assign(Object.assign({ model: Domain, as: 'domain' }, domainCondition), { duplicating: true }),
                        Object.assign(Object.assign({ model: Category, as: 'category', attributes: ['id', 'name'] }, categoriesCondition), { duplicating: true, include: [
                                {
                                    model: CategoryTranslation,
                                    as: 'localization',
                                    attributes: ['id', 'name'],
                                    duplicating: true,
                                    include: [
                                        Object.assign(Object.assign({ model: Language, as: 'language', attributes: ['id', 'code', 'name'] }, langCondition), { duplicating: true }),
                                    ],
                                },
                            ] }),
                        Object.assign(Object.assign({ model: ArticleTranslation, as: 'localization', order: [['pub_date', 'DESC']] }, pubDateCondition), { duplicating: true, include: [
                                Object.assign(Object.assign({ model: Language, as: 'language' }, langCondition), { duplicating: true }),
                            ] }),
                    ],
                    limit: limit,
                    offset: (page - 1) * limit,
                    order: [['createdAt', 'DESC']],
                });
                const _ = yield Article.findAll({
                    attributes: ['id', 'name', 'createdAt', 'updatedAt'],
                    include: [
                        {
                            model: Thumbnail,
                            as: 'thumbnail',
                            duplicating: true,
                        },
                        Object.assign(Object.assign({ model: Domain, as: 'domain' }, domainCondition), { duplicating: true }),
                        Object.assign(Object.assign({ model: Category, as: 'category', attributes: ['id', 'name'] }, categoriesCondition), { duplicating: true, include: [
                                {
                                    model: CategoryTranslation,
                                    as: 'localization',
                                    attributes: ['id', 'name'],
                                    duplicating: true,
                                    include: [
                                        Object.assign(Object.assign({ model: Language, as: 'language', attributes: ['id', 'code', 'name'] }, langCondition), { duplicating: true }),
                                    ],
                                },
                            ] }),
                        Object.assign(Object.assign({ model: ArticleTranslation, as: 'localization', order: [['pub_date', 'DESC']] }, pubDateCondition), { duplicating: true, include: [
                                Object.assign(Object.assign({ model: Language, as: 'language' }, langCondition), { duplicating: true }),
                            ] }),
                    ],
                    limit: 999999999999999,
                    offset: 0,
                    subQuery: true
                });
                const total = _.length;
                return res.json({
                    data: [...articles],
                    meta: {
                        limit,
                        page,
                        total,
                        pages: Math.ceil(total / limit),
                    },
                });
            }
            catch (error) {
                console.log(error);
                Logger.error(error);
                return res.status(500).json({ error });
            }
        });
    }
    static createDomain(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { ip_address, url } = req.body;
                const schema = Joi.object({
                    ip_address: Joi.string().ip().required(),
                    url: Joi.string().uri().required(),
                });
                const { error } = schema.validate({ ip_address, url });
                if (error) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: error.details[0].message,
                        },
                    });
                }
                const domain = yield Domain.findOne({
                    where: {
                        url: url,
                    },
                });
                if (domain) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Domain with provided url already exists`,
                        },
                    });
                }
                const createdDomain = yield Domain.create({
                    url,
                    ip_address,
                });
                Logger.info(`Article created successfully`);
                return res.json({
                    data: Object.assign({}, createdDomain.dataValues),
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    static createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // const { value: data, error } = isValidArticleBody(req.body);
                // if (error) {
                //   return res.status(400).json({
                //     error: {
                //       statusCode: 400,
                //       message: error.details[0].message,
                //     },
                //   });
                // }
                const { name, categoryId, authorId, domainId = null, translations, thumbnailId, } = req.body;
                const categoryExists = yield Category.findOne({
                    where: {
                        id: categoryId,
                    },
                });
                if (!categoryExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Category with provided id does not exist`,
                        },
                    });
                }
                if (domainId) {
                    const domainExists = yield Domain.findOne({
                        where: {
                            id: domainId,
                        },
                    });
                    if (!domainExists) {
                        return res.status(404).json({
                            error: {
                                statusCode: 404,
                                message: `Domain with provided id does not exist`,
                            },
                        });
                    }
                }
                const authorExists = yield User.findOne({
                    where: {
                        id: authorId,
                    },
                });
                if (!authorExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `User with provided id does not exist`,
                        },
                    });
                }
                const articleExists = yield Article.findOne({
                    where: {
                        name,
                    },
                });
                if (articleExists) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: `Статья с таким UI именем уже существует.`,
                        },
                    });
                }
                const createdArticle = yield Article.create({
                    name,
                    authorId,
                    categoryId,
                    domainId,
                    thumbnailId,
                });
                let createdLocalizations;
                if (translations.length) {
                    const localizations = translations.map((trans) => {
                        trans.articleId = createdArticle.dataValues.id;
                        trans.slug = slugify(trans.title);
                        delete trans.createdAt;
                        return trans;
                    });
                    createdLocalizations = yield ArticleTranslation.bulkCreate(localizations);
                    console.log(createdLocalizations);
                }
                Logger.info(`Article created successfully`);
                return res.json({
                    data: {
                        article: createdArticle.dataValues,
                        localizations: createdLocalizations,
                    },
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!validator.isUUID(id, 4)) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Inavlid article id was provided',
                    },
                });
            }
            const categoryExists = yield Category.findOne({
                where: {
                    id,
                }
            });
            if (!categoryExists) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: 'Домена с таким ID не существует',
                    },
                });
            }
            const { name, translations = {} } = req.body;
            const schema = Joi.object({
                name: Joi.string().min(2),
                translations: Joi.object().pattern(Joi.string().uuid(), Joi.string().min(2)).optional()
            });
            const { error, value } = schema.validate({ name, translations });
            if (error) {
                return res.status(400).json({
                    error: {
                        statusCode: 400,
                        message: error.details[0].message,
                    },
                });
            }
            const updatedCategory = Category.update({
                name
            }, {
                where: {
                    id
                }
            });
            const updateTranslations = (trans) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield CategoryTranslation.upsert(Object.assign({}, trans));
                }
                catch (error) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Во время обновления статьи произошла ошибка, пожалуйста проверьте правильно введенных данных!',
                        },
                    });
                }
            });
            const translationsArray = Object.entries(translations).map((trans) => {
                const [languageId, name] = trans;
                const newTranslation = {
                    categoryId: id,
                    languageId,
                    name
                };
                return newTranslation;
            });
            if (translationsArray.length) {
                translationsArray.forEach(updateTranslations);
            }
            Logger.info(`Article created successfully`);
            return res.json({
                data: {
                    success: true,
                },
            });
        });
    }
    static updateArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const articleId = id;
                if (!validator.isUUID(id, 4)) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Неверно указанный id',
                        },
                    });
                }
                const articleExists = yield Article.findOne({
                    where: {
                        id,
                    },
                });
                if (!articleExists) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: `Такой статьи не существует`,
                        },
                    });
                }
                // const { value: data, error } = isValidArticleBody(req.body);
                // if (error) {
                //   return res.status(400).json({
                //     error: {
                //       statusCode: 400,
                //       message: error.details[0].message,
                //     },
                //   });
                // }
                const { name, categoryId, authorId, thumbnailId, domainId, translations } = req.body;
                const categoryExists = yield Category.findOne({
                    where: {
                        id: categoryId,
                    },
                });
                if (!categoryExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Категории с указанным id не существует`,
                        },
                    });
                }
                if (domainId) {
                    const domainExists = yield Domain.findOne({
                        where: {
                            id: domainId,
                        },
                    });
                    if (!domainExists) {
                        return res.status(404).json({
                            error: {
                                statusCode: 404,
                                message: `Домена с указанным id не существует`,
                            },
                        });
                    }
                }
                const authorExists = yield User.findOne({
                    where: {
                        id: authorId,
                    },
                });
                if (!authorExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Пользователя с указанным id не существует`,
                        },
                    });
                }
                const updateData = {
                    name,
                    authorId,
                    categoryId,
                    domainId,
                };
                thumbnailId ? updateData.thumbnailId = thumbnailId : null;
                yield Article.update(updateData, {
                    where: {
                        id: articleId,
                    },
                    returning: true,
                });
                const updateTranslation = (localization) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        localization.articleId = articleId;
                        localization.slug = slugify(localization.title);
                        yield ArticleTranslation.upsert(Object.assign({}, localization));
                    }
                    catch (error) {
                        return res.status(400).json({
                            error: {
                                statusCode: 400,
                                message: 'Во время обновления статьи произошла ошибка, пожалуйста проверьте правильно введенных данных!',
                            },
                        });
                    }
                });
                if (translations.length) {
                    translations.forEach(updateTranslation);
                }
                Logger.info(`Статья успешно создана`);
                return res.json({
                    data: {
                        success: true,
                    },
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    static createArticleLocalization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { value: data, error } = isValidArticleLoc(Object.assign(Object.assign({}, req.body), { articleId: id }));
                const { title, languageId, articleId } = data;
                const slug = slugify(title);
                if (error) {
                    return res.status(400).json({ error });
                }
                const articleExist = yield Article.findOne({
                    where: {
                        id: articleId,
                    },
                });
                if (!articleExist) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Статьи с указанным id не существует`,
                        },
                    });
                }
                const languageExists = yield Language.findOne({
                    where: {
                        id: languageId,
                    },
                });
                if (!languageExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Языка с указанным id не существует`,
                        },
                    });
                }
                const createdLocalization = yield ArticleTranslation.create(Object.assign(Object.assign({}, data), { slug }));
                Logger.info(`Перевод "${title}" успешно создан`);
                return res.json({
                    data: Object.assign({}, createdLocalization.dataValues),
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { value: data, error } = isValidCategoryBody(req.body);
                if (error) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: error.details[0].message
                        }
                    });
                }
                const { name, translations } = data;
                const categoryExists = yield Category.findOne({
                    where: {
                        name,
                    },
                });
                if (categoryExists) {
                    return res.status(409).json({
                        error: {
                            statusCode: 409,
                            message: `Категория ${name} уже существует`,
                        },
                    });
                }
                const createdCategory = yield Category.create({
                    name,
                });
                const categoryId = createdCategory.dataValues.id;
                const translationsArray = Object.entries(translations).map((trans) => {
                    const [languageId, name] = trans;
                    const newTranslation = {
                        categoryId,
                        languageId,
                        name
                    };
                    return newTranslation;
                });
                if (translationsArray.length) {
                    yield CategoryTranslation.bulkCreate(translationsArray);
                }
                Logger.info(`Категория "${name}" успешно создана`);
                return res.json({
                    data: Object.assign({}, createdCategory.dataValues),
                });
            }
            catch (error) {
                return res.status(500).json({ error: {
                        statusCode: 500,
                        message: 'Во время выполнения запроса возникла непредвиденная ошибка'
                    } });
            }
        });
    }
    static getCategories(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { lang, limit, page } = isValidQueryParams(req.query);
                const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
                const categories = yield Category.findAll({
                    include: [
                        {
                            model: CategoryTranslation,
                            as: 'localization',
                            include: [
                                Object.assign({ model: Language, as: 'language' }, langCondition),
                            ],
                        },
                    ],
                    limit: limit,
                    offset: (page - 1) * limit,
                });
                const _ = yield Category.findAll({
                    include: [
                        {
                            model: CategoryTranslation,
                            as: 'localization',
                            include: [
                                Object.assign({ model: Language, as: 'language' }, langCondition),
                            ],
                        },
                    ],
                    limit: 999999999999,
                    offset: 0,
                });
                const total = _.length;
                return res.json({
                    data: [...categories],
                    meta: {
                        limit,
                        page,
                        total,
                        pages: Math.ceil(total / limit),
                    },
                });
            }
            catch (error) {
                Logger.error(error);
                return res.status(500).json({ error });
            }
        });
    }
    static getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (!validator.isUUID(id, 4)) {
                    return res.status(400).json({
                        error: {
                            statusCode: 400,
                            message: 'Предоставлен неверный идентификатор категории',
                        },
                    });
                }
                const { lang } = isValidQueryParams(req.query);
                const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
                const category = yield Category.findOne({
                    where: {
                        id,
                    },
                    include: [
                        {
                            model: CategoryTranslation,
                            as: 'localization',
                            include: [
                                Object.assign({ model: Language, as: 'language' }, langCondition),
                            ],
                        },
                    ],
                });
                return res.json({
                    data: category,
                    meta: {},
                });
            }
            catch (error) {
                Logger.error(error);
                return res.status(500).json({ error });
            }
        });
    }
    static createCategoryLocalization(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { value: data, error } = isValidCategoryLoc(Object.assign(Object.assign({}, req.body), { categoryId: id }));
                const { name, languageId, categoryId } = data;
                if (error) {
                    return res.status(400).json({ error });
                }
                const categoryExists = yield Category.findOne({
                    where: {
                        id: categoryId,
                    },
                });
                if (!categoryExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Категории с таким id не существует`,
                        },
                    });
                }
                const languageExists = yield Language.findOne({
                    where: {
                        id: languageId,
                    },
                });
                if (!languageExists) {
                    return res.status(404).json({
                        error: {
                            statusCode: 404,
                            message: `Языка с таким id не существует`,
                        },
                    });
                }
                const createdLocalization = yield CategoryTranslation.create({
                    name,
                    categoryId,
                    languageId,
                });
                Logger.info(`Перевод "${name}" успешно создан`);
                return res.json({
                    data: Object.assign({}, createdLocalization.dataValues),
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ error });
            }
        });
    }
}
