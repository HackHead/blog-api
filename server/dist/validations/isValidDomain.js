import Joi from 'joi';
const isValidCategoryBody = (body) => {
    const schema = Joi.object({
        ip_address: Joi.string().ip().optional(),
        url: Joi.string().optional().uri(),
    });
    return schema.validate(Object.assign({}, body));
};
export default isValidCategoryBody;
