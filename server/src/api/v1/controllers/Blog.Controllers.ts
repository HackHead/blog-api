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

const validator = val.default;

export default class BlogControllers {
  public static async deleteArticleTranslation(req: Request, res: Response) {
    const { id } = req.params;

    if (!uuidValidate(id)) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid id provided',
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
    const {ids} = req.query;

    if (typeof ids === 'string' && !isValidUUIDArray(ids?.split(','))) {
      return res.status(400).json({
        error: {
          statusCode: 400,
          message: 'Invalid array of uuids provded',
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
          message: 'Invalid id provided',
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
    const {ids} = req.query;

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

  public static async deleteCategories(req: Request, res: Response) {
    const {ids} = req.query;

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
      const { lang, limit, page, categories } = isValidQueryParams(req.query);

      const langCondition = lang ? { where: { code: { [Op.in]: lang } } } : {};
      const categoriesCondition = categories
        ? { where: { name: { [Op.in]: categories } } }
        : {};

      const articles = await Article.findAll({
        attributes: [
          'id',
          'thumbnail',
          'pub_date',
          'name',
          'createdAt',
          'updatedAt',
        ],
        include: [
          {
            model: User,
            as: 'author',
            attributes: ['first_name', 'last_name', 'full_name', 'email'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'name'],
            ...categoriesCondition,
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

      const total = await Article.count();

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

  public static async createArticle(req: Request, res: Response) {
    try {
      const { value: data, error } = isValidArticleBody(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const { name, categoryId, authorId, thumbnail, pubDate } = data;

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

      const createdArticle = await Article.create({
        name,
        categoryId,
        authorId,
        thumbnail,
        pubDate,
      });

      Logger.info(`Article created successfully`);

      return res.json({
        data: {
          ...createdArticle.dataValues,
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
            message: `Article with provided id does not exist`,
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
            message: `Language with provided id does not exist`,
          },
        });
      }

      const createdLocalization = await ArticleTranslation.create({
        ...data,
        slug,
      });

      Logger.info(`Localization "${title}" created successfully`);

      return res.json({
        data: {
          ...createdLocalization.dataValues,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  }

  public static async createCategory(req: Request, res: Response) {
    try {
      const { value: data, error } = isValidCategoryBody(req.body);

      if (error) {
        return res.status(400).json({ error });
      }

      const { name } = data;

      const categoryExists = await Category.findOne({
        where: {
          name,
        },
      });

      if (categoryExists) {
        return res.status(409).json({
          error: {
            statusCode: 409,
            message: `Category ${name} already exists`,
          },
        });
      }

      const createdCategory = await Category.create({
        name,
      });

      Logger.info(`Category "${name}" created successfully`);

      return res.json({
        data: {
          ...createdCategory.dataValues,
        },
      });
    } catch (error) {
      return res.status(500).json({ error });
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

      const total = await Category.count();

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
            message: 'Inavlid category id was provided',
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
            message: `Category with provided id does not exist`,
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
            message: `Language with provided id does not exist`,
          },
        });
      }

      const createdLocalization = await CategoryTranslation.create({
        name,
        categoryId,
        languageId,
      });

      Logger.info(`Localization "${name}" created successfully`);
      return res.json({
        data: {
          ...createdLocalization.dataValues,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  }
}
