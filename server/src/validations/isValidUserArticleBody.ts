import Joi, { ValidationResult } from "joi";

const isValidArticleBody = (body: any): ValidationResult => {
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(64),
        categoryId: Joi.string().uuid().required(),
        authorId: Joi.string().uuid().required(),
        thumbnail: Joi.string().required(),
        pubDate: Joi.date().optional(),
    });
    
    return schema.validate({...body});
};

export default isValidArticleBody;