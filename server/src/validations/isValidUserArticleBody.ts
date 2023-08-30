import Joi, { ValidationResult } from 'joi';

const isValidArticleBody = (body: any): ValidationResult => {
  const translationSchema = Joi.object({
    id: Joi.string().uuid().optional(),
    title: Joi.string().optional(),
    author_name: Joi.string().optional(),
    languageId: Joi.string().uuid().optional(),
    body: Joi.string().max(65536).optional(),
    excerpt: Joi.string().max(512).optional(),
    pub_date: Joi.date().optional(),
  });

  const schema = Joi.object({
    name: Joi.string().optional(),
    categoryId: Joi.string().uuid().optional(),
    authorId: Joi.string().uuid().optional(),
    domainId: Joi.string().allow(null).uuid().optional(),
    thumbnailId: Joi.string().uuid().allow(null).optional(),
    translations: Joi.array().items(translationSchema).optional(),
  });

  return schema.validate({ ...body });
};

export default isValidArticleBody;
