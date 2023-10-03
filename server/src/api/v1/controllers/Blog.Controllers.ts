import { validate as uuidValidate } from 'uuid';
import { Op } from 'sequelize';
import { Request, Response } from 'express';
import isValidCategoryLoc from '../../../validations/isValidCategoryLocalization.js';
import isValidCategoryBody from '../../../validations/isValidCategoryBody.js';
import Category from '../../../models/Category.js';
import Logger from '../../../modules/Logger.js';
import CategoryTranslation from '../../../models/CategoryTranslation.js';
import isValidArticleBody from '../../../validations/isValidUserArticleBody.js';
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
import moment from 'moment-timezone';

const validator = val.default;

export default class BlogControllers {
  public static async updateThumbnail(req: Request, res: Response) {
    try {
      const {id} = req.params;
      const {alt} = req.body;
      
      const schema = Joi.object({
        alt: Joi.string().required().min(2)
      })
      
      const {error} = schema.validate({
        alt
      })

      if(error){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: error.details[0].message
          }
        })
      }
      
      const thumnailExists = await Thumbnail.findOne({
        where: {
          id
        }
      })

      if (!thumnailExists) {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: 'Такой миниатюры не существует',
          },
        });
      }
     
      await Thumbnail.update({
        alt,
      }, {
        where: {
          id
        }
      })

      return res.json({
        data: thumnailExists,
        meta: {}
      })
    } catch (error) {
      return res.status(500).json({
        error: {
          statusCode: 500,
          message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
        },
      });
    }
  }
  public static async getLanguages(req: Request, res: Response) {
    try {
      const langauges = await Language.findAll();

      return res.json({
        data: langauges,
      });
    } catch (error) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
        },
      });
    }
  }

  public static async updateDomain(req: Request, res: Response) {
    const { id } = req.params;
    
    if (!validator.isUUID(id, 4)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Недействительный id',
        },
      });
    }
    const domainExists = await Domain.findOne({
      where: {
        id,
      }
    })
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
      })
    }

    const updatedDomain = await Domain.update({
      ...req.body
    }, {
      where: {
        id,
      },
      returning: true,
    })

    return res.json({
      domain: updatedDomain,
    })
  }
  public static async getArticleById(req: Request, res: Response) {
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

      const article = await Article.findOne({
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
                  {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'code', 'name'],
                    ...langCondition,
                  },
                ],
              },
            ],
          },
          {
            model: ArticleTranslation,
            as: 'localization',
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
              },
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
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ error });
    }
  }

  public static async getDomains(req: Request, res: Response) {
    try {
      const domains = await Domain.findAll();

      return res.json({
        data: domains,
      });
    } catch (error) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Возникла ошибка, пожалуйста попробуйте еще раз',
        },
      });
    }
  }

  

  public static async deleteArticleTranslation(req: Request, res: Response) {
    const { id } = req.params;

    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Недействительный id',
        },
      });
    }

    const deletedArticle = await ArticleTranslation.destroy({
      where: {
        id,
      },
    });

    return res.json({
      data: deletedArticle,
      meta: {},
    });
  }

  public static async deleteCategoryTranslation(req: Request, res: Response) {
    const { ids } = req.query;

    if (typeof ids === 'string' && !isValidUUIDArray(ids?.split(','))) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Массив идентификатор недействителен',
        },
      });
    }

    const deletedTranslation = await CategoryTranslation.destroy({
      where: {
        id: ids,
      },
    });

    return res.json({
      data: deletedTranslation,
      meta: {},
    });
  }

  public static async deleteArticle(req: Request, res: Response) {
    const { id } = req.params;

    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Недействительный id',
        },
      });
    }

    const deletedArticle = await Article.destroy({
      where: {
        id,
      },
    });

    return res.json({
      data: deletedArticle,
      meta: {},
    });
  }

  public static async deleteArticles(req: Request, res: Response) {
    const { ids } = req.query;

    if (typeof ids === 'string' && !isValidUUIDArray(ids?.split(','))) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid array of uuids provded',
        },
      });
    }

    const deletedArticles = await Article.destroy({
      where: {
        id: ids,
      },
    });

    return res.json({
      data: deletedArticles,
      meta: {},
    });
  }

  public static async deleteCategory(req: Request, res: Response) {
    const { id } = req.params;

    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid id provided',
        },
      });
    }

    const deletedCategory = await Category.destroy({
      where: {
        id,
      },
    });

    return res.json({
      data: deletedCategory,
      meta: {},
    });
  }

  public static async deleteDomain(req: Request, res: Response) {
    const { id } = req.params;

    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid id provided',
        },
      });
    }

    const deletedDomain = await Domain.destroy({
      where: {
        id,
      },
    });

    return res.json({
      data: deletedDomain,
      meta: {},
    });
  }

  public static async deleteCategories(req: Request, res: Response) {
    const { ids } = req.query;

    if (typeof ids === 'string' && !isValidUUIDArray(ids?.split(','))) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid array of uuids provded',
        },
      });
    }

    const deletedCategories = await Category.destroy({
      where: {
        id: ids,
      },
    });

    return res.json({
      data: deletedCategories,
      meta: {},
    });
  }

  public static async getArticles(req: Request, res: Response) {
    try {
      const { lang, limit, page, categories, domain, dateFrom = new Date('1971-01-01'), dateTo = new Date()} = isValidQueryParams(
        req.query
      );


      const pubDateCondition = {
        where: {
          pub_date: {
            [Op.between]: [dateFrom, dateTo]
          }
        }
      }
      const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
      const categoriesCondition = categories
        ? { where: { id: { [Op.in]: categories } } }
        : {};


      const domainCondition = domain ? { where: { url: domain } } : {};
      
      const articles = await Article.findAll({
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
          {
            model: Domain,
            as: 'domain',
            ...domainCondition,
            duplicating: true,
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            ...categoriesCondition,
            duplicating: true,

            include: [
              {
                model: CategoryTranslation,
                as: 'localization',
                attributes: ['id', 'name'],
                duplicating: true,

                include: [
                  {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'code', 'name'],
                    ...langCondition,
                    duplicating: true,
                  },
                ],
              },
            ],
          },
          {
            model: ArticleTranslation,
            as: 'localization',
            order: [['pub_date', 'DESC']],
            ...pubDateCondition,
            duplicating: true,
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
                duplicating: true,

              },
            ],
          },
        ],
        limit: limit,
        offset: (page - 1) * limit,
        order: [['createdAt', 'DESC']],
      });

      const _ = await Article.findAll({
        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
        include: [
          {
            model: Thumbnail,
            as: 'thumbnail',
            duplicating: true,
          },
          {
            model: Domain,
            as: 'domain',
            ...domainCondition,
            duplicating: true,
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            ...categoriesCondition,
            duplicating: true,
            include: [
              {
                model: CategoryTranslation,
                as: 'localization',
                attributes: ['id', 'name'],
                duplicating: true,

                include: [
                  {
                    model: Language,
                    as: 'language',
                    attributes: ['id', 'code', 'name'],
                    ...langCondition,
                    duplicating: true,
                  },
                ],
              },
            ],
          },
          {
            model: ArticleTranslation,
            as: 'localization',
            order: [['pub_date', 'DESC']],
            ...pubDateCondition,
            duplicating: true,
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
                duplicating: true,

              },
            ],
          },
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
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ error });
    }
  }

  public static async createDomain(req: Request, res: Response) {
    try {
      const { ip_address, url } = req.body;

      const schema = Joi.object({
        ip_address: Joi.string().ip().required(),
        url: Joi.string().uri().required(),
      })
      
      const {error} = schema.validate({ip_address, url});

      if(error){
        return res.status(400).json({
          error: {
            statusCode: 400,
            message: error.details[0].message,
          },
        });
      }
      
      const domain = await Domain.findOne({
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

      const createdDomain = await Domain.create({
        url,
        ip_address,
      });

      Logger.info(`Article created successfully`);

      return res.json({
        data: {
          ...createdDomain.dataValues,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public static async createArticle(req: Request, res: Response) {
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

      const {
        name,
        categoryId,
        authorId,
        domainId = null,
        translations,
        thumbnailId,
      } = req.body;

      const categoryExists = await Category.findOne({
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
        const domainExists = await Domain.findOne({
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

      const authorExists = await User.findOne({
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

      const articleExists = await Article.findOne({
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

      const createdArticle = await Article.create({
        name,
        authorId,
        categoryId,
        domainId,
        thumbnailId,
      });

      let createdLocalizations;
      console.log(translations)
      
      if (translations.length) {
        const localizations = translations.map((trans: any) => {
          trans.articleId = createdArticle.dataValues.id;
          trans.slug = slugify(trans.title);
          trans.pub_date = moment(trans.pub_date).tz('Europe/Kiev').format()
          delete trans.createdAt;
          return trans;
        });
        console.log(localizations)
        createdLocalizations = await ArticleTranslation.bulkCreate(
          localizations
        );

      }
      
      Logger.info(`Article created successfully`);

      return res.json({
        data: {
          article: createdArticle.dataValues,
          localizations: createdLocalizations,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public static async updateCategory(req: Request, res: Response) {
    const { id } = req.params;
    if (!validator.isUUID(id, 4)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Inavlid article id was provided',
        },
      });
    }
    const categoryExists = await Category.findOne({
      where: {
        id,
      }
    })
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
      translations: Joi.object().pattern(
        Joi.string().uuid(),
        Joi.string().min(2)
      ).optional()
    })

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
    })

    const updateTranslations = async (trans: any) => {
      try {
        await CategoryTranslation.upsert({
          ...trans,
        });
      } catch (error) {
        return res.status(400).json({
          error: {
            statusCode: 400,
            message:
              'Во время обновления статьи произошла ошибка, пожалуйста проверьте правильно введенных данных!',
          },
        });
      }
    }
    const translationsArray = Object.entries(translations).map((trans) => {
      const [languageId, name] = trans;


      const newTranslation = {
        categoryId: id,
        languageId,
        name
      }

      return newTranslation
    })

    if (translationsArray.length) {
      translationsArray.forEach(updateTranslations);
    }
    Logger.info(`Article created successfully`);

    return res.json({
      data: {
        success: true,
      },
    });
  }

  public static async updateArticle(req: Request, res: Response) {
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

      const articleExists = await Article.findOne({
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

      const { name, categoryId, authorId, thumbnailId, domainId, translations } =
        req.body;

        
      const categoryExists = await Category.findOne({
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
        const domainExists = await Domain.findOne({
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

      const authorExists = await User.findOne({
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
      } as any

      thumbnailId ? updateData.thumbnailId = thumbnailId : null;
      
      await Article.update(
        updateData,
        {
          where: {
            id: articleId,
          },
          returning: true,
        }
      );

      const updateTranslation = async (localization: any) => {
        try {
          localization.articleId = articleId;
          localization.slug = slugify(localization.title)
          localization.pub_date = moment(localization.pub_date).tz('Europe/Kiev').format()
          await ArticleTranslation.upsert({
            ...localization,
          });

        } catch (error) {
          return res.status(400).json({
            error: {
              statusCode: 400,
              message:
                'Во время обновления статьи произошла ошибка, пожалуйста проверьте правильно введенных данных!',
            },
          });
        }
      };

      if (translations.length) {
        translations.forEach(updateTranslation);
      }
      console.log(translations)
      Logger.info(`Статья успешно создана`);

      return res.json({
        data: {
          success: true,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public static async createArticleLocalization(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const { value: data, error } = isValidArticleLoc({
        ...req.body,
        articleId: id,
      });
      
      const { title, languageId, articleId } = data;
      const slug = slugify(title);

      if (error) {
        return res.status(400).json({ error });
      }

      const articleExist = await Article.findOne({
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

      const languageExists = await Language.findOne({
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

      const createdLocalization = await ArticleTranslation.create({
        ...data,
        slug,
      });

      Logger.info(`Перевод "${title}" успешно создан`);

      return res.json({
        data: {
          ...createdLocalization.dataValues,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }

  public static async createCategory(req: Request, res: Response) {
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

      
      const categoryExists = await Category.findOne({
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

      const createdCategory = await Category.create({
        name,
      });


      const categoryId = createdCategory.dataValues.id;
      const translationsArray = Object.entries(translations).map((trans) => {
        const [languageId, name] = trans;

        const newTranslation = {
          categoryId,
          languageId,
          name
        }

        return newTranslation
      })
      
      if (translationsArray.length) {
        await CategoryTranslation.bulkCreate(translationsArray)
      }

      Logger.info(`Категория "${name}" успешно создана`);

      return res.json({
        data: {
          ...createdCategory.dataValues,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: {
        statusCode: 500,
        message: 'Во время выполнения запроса возникла непредвиденная ошибка'
      } });
    }
  }

  public static async getCategories(req: Request, res: Response) {
    try {
      const { lang, limit, page } = isValidQueryParams(req.query);
      const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
      const categories = await Category.findAll({
        include: [
          {
            model: CategoryTranslation,
            as: 'localization',
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
              },
            ],
          },
        ],
        limit: limit,
        offset: (page - 1) * limit,
      });

      const _ = await Category.findAll({
        include: [
          {
            model: CategoryTranslation,
            as: 'localization',
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
              },
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
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ error });
    }
  }

  public static async getCategory(req: Request, res: Response) {
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

      const category = await Category.findOne({
        where: {
          id,
        },
        include: [
          {
            model: CategoryTranslation,
            as: 'localization',
            include: [
              {
                model: Language,
                as: 'language',
                ...langCondition,
              },
            ],
          },
        ],
      });

      return res.json({
        data: category,
        meta: {},
      });
    } catch (error) {
      Logger.error(error);
      return res.status(500).json({ error });
    }
  }

  public static async createCategoryLocalization(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { value: data, error } = isValidCategoryLoc({
        ...req.body,
        categoryId: id,
      });

      const { name, languageId, categoryId } = data;

      if (error) {
        return res.status(400).json({ error });
      }

      const categoryExists = await Category.findOne({
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

      const languageExists = await Language.findOne({
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

      const createdLocalization = await CategoryTranslation.create({
        name,
        categoryId,
        languageId,
      });

      Logger.info(`Перевод "${name}" успешно создан`);
      return res.json({
        data: {
          ...createdLocalization.dataValues,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
}
