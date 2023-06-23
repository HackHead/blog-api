import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

const isValidUserRegBody = (body: any) => {
  if (!Array.isArray(body)) {
    return false;
  }

  for (let uuid of body) {
    if (!uuidValidate(uuid)) {
      return false;
    }
  }

  return true;
};

export default isValidUserRegBody;
