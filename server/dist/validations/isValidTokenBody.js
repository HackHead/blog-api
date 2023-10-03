import Joi from 'joi';
const isValidTokenBody = (body) => {
    const { name, expirationDate, description, accessRights = 'readOnly' } = body;
    const schema = Joi.object({
        name: Joi.string().required().min(2).max(32),
        expirationDate: Joi.date().optional(),
        description: Joi.string().max(512),
        accessRights: Joi.string().valid('readOnly', 'fullAccess').required(),
    });
    return schema.validate({
        name,
        expirationDate,
        description,
        accessRights,
    });
};
export default isValidTokenBody;
