import Joi from 'joi';
import val from 'validator';

const validator = val.default;

export interface ParsingResults {
  page: number;
  limit: number;
  lang: Array<string>;
  categories: Array<string>;
  pub_date: Date;
  domain: string;
}

const isValidQueryParams = (params: any): ParsingResults => {
  let { limit = '15', page = '1', lang, categories, pub_date, domain } = params;

  const restParams = {} as ParsingResults;

  if (
    !validator.isInt(limit) ||
    !validator.isFloat(limit, { gt: 0, lt: 101 })
  ) {
    restParams.limit = 15;
  } else {
    restParams.limit = Number(limit);
  }

  if (!validator.isInt(page) || !validator.isFloat(page, { gt: 0 })) {
    restParams.page = 1;
  } else {
    restParams.page = Number(page);
  }

  
  if (lang) {
    const parsed = lang.split(',');

    if (
      parsed.every((language: string) => {
        return (
          validator.isLength(language, { min: 2, max: 2 }) &&
          validator.isAlpha(language)
        );
      })
    ) {
      restParams.lang = parsed;
    }
  }

  if (pub_date && !isNaN(Date.parse(pub_date))) {
    restParams.pub_date = pub_date;
  }

  if (categories) {
    const parsed = categories.split(',');
    if (
      parsed.every((category: string) => {
        return (
          validator.isLength(category, { min: 1, max: 64 }) &&
          validator.isUUID(category)
        );
      })
    ) {
      restParams.categories = parsed;
    }
  }
  if (domain) {

    const schema = Joi.object({
      domain: Joi.string().uri(),
    })
    
    const {error} = schema.validate({
      domain
    })

    if(!error){
      restParams.domain = domain
    }
  }
  return {
    ...restParams,
  };
};

export default isValidQueryParams;
