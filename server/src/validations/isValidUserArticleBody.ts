import Joi, { ValidationResult } from 'joi';

const isValidArticleBody = (body: any): ValidationResult => {
  const translationSchema = Joi.object({
    id: Joi.string().uuid().optional(),
    title: Joi.string().min(2).max(64).required(),
    languageId: Joi.string().uuid().required(),
    body: Joi.string().max(65536).required(),
    excerpt: Joi.string().max(512).required(),
    pub_date: Joi.date().required(),
  });

  const schema = Joi.object({
    name: Joi.string().required().min(2).max(64),
    categoryId: Joi.string().uuid().required(),
    authorId: Joi.string().uuid().required(),
    domainId: Joi.string().allow(null).uuid().optional(),
    thumbnailId: Joi.string().uuid().optional().allow(null),
    translations: Joi.array().items(translationSchema).optional(),
  });

  return schema.validate({ ...body });
};

export default isValidArticleBody;
