import Joi from "joi";
import val from "validator";
const validator = val.default;
export interface ParsingResults {
    page: number;
    limit: number;
    lang?: string;
}

const isValidQueryParams = (params: any): ParsingResults => {
    let {limit = 15, page = '1'} = params;

    if(
        !validator.isInt(`${limit}`) ||
        !validator.isFloat(`${limit}`, {gt: 0, lt: 101})
    ) { limit = 15 }
    if(
        !validator.isInt(page) ||
        !validator.isFloat(page, {gt: 0})
    ) { page = 20 }

    console.log(limit)
    return {
        page: 1,
        limit,
        lang: 'ua'
    }
}

export default isValidQueryParams;