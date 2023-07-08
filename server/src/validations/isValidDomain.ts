import Joi, { ValidationResult } from 'joi';

const isValidCategoryBody = (body: any): ValidationResult => {
  const schema = Joi.object({
    ip_address: Joi.string().ip().optional(),
    url: Joi.string().optional().uri(),
  });

  return schema.validate({ ...body });
};

export default isValidCategoryBody;
