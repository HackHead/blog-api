import Joi, { ValidationResult } from "joi";

const isValidUserRegBody = (body: any): ValidationResult => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(2).max(64),
        last_name: Joi.string().required().min(2).max(64),
        email: Joi.string().email(),
        password: Joi.string().required().min(4),
    });
    
    return schema.validate({...body});
};

export default isValidUserRegBody;