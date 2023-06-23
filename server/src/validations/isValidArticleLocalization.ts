import Joi, { ValidationResult } from 'joi';

const isValidArticleLoc = (body: any): ValidationResult => {
  const schema = Joi.object({
    title: Joi.string().required().min(2).max(64),
    languageId: Joi.string().uuid().required(),
    articleId: Joi.string().uuid().required(),
    body: Joi.string().max(65536).required(),
    excerpt: Joi.string().max(512).required(),
  });

  return schema.validate({ ...body });
};

export default isValidArticleLoc;
