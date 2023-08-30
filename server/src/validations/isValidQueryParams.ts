import Joi from 'joi';
import val from 'validator';

const validator = val.default;

export interface ParsingResults {
  page: number;
  limit: number;
  lang: Array<string>;
  categories: Array<string>;
  pub_date: Date;
  dateFrom: Date;
  dateTo: Date;
  domain: string;
}

const isValidQueryParams = (params: any): ParsingResults => {
  let { limit = '15', page = '1', lang, categories, pub_date, domain, dateFrom, dateTo } = params;

  console.log(params)
  
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


  if (dateFrom && !isNaN(Date.parse(dateFrom))) {
    restParams.dateFrom = dateFrom;
  }

  if (dateTo && !isNaN(Date.parse(dateTo))) {
    restParams.dateTo = dateTo;
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
