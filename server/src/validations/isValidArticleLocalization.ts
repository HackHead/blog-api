import Joi, { ValidationResult } from 'joi';

const isValidArticleLoc = (body: any): ValidationResult => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    languageId: Joi.string().uuid().optional(),
    articleId: Joi.string().uuid().optional(),
    body: Joi.string().max(65536).optional(),
    excerpt: Joi.string().max(512).optional(),
  });

  return schema.validate({ ...body });
};

export default isValidArticleLoc;
