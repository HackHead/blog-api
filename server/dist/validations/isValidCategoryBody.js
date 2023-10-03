import Joi from 'joi';
const isValidCategoryBody = (body) => {
    const translations = Joi.object().pattern(Joi.string().uuid(), Joi.string().min(2)).optional();
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(64),
        translations: translations
    });
    return schema.validate(Object.assign({}, body));
};
export default isValidCategoryBody;
