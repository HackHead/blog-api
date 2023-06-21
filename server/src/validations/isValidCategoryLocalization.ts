import Joi, { ValidationResult } from "joi";

const isValidCategoryLoc = (body: any): ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(64),
        categoryId: Joi.string().uuid().required(),
        languageId: Joi.string().uuid().required(),
    });
    
    return schema.validate({...body});
};

export default isValidCategoryLoc;