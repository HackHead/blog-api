import Joi, { ValidationResult } from 'joi';

const isValidCategoryBody = (body: any): ValidationResult => {
  const translations = Joi.object().pattern(
    Joi.string().uuid(),
    Joi.string().min(2)
  ).optional();
  
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(64),
    translations: translations
  });

  return schema.validate({ ...body });
};

export default isValidCategoryBody;
