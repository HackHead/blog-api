import { validate as uuidValidate } from 'uuid';
const isValidUserRegBody = (body) => {
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
