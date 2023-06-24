import Joi, { ValidationResult } from 'joi';

const isValidCategoryBody = (body: any): ValidationResult => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(64),
  });

  return schema.validate({ ...body });
};

export default isValidCategoryBody;
