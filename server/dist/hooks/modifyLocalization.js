import { Model } from 'sequelize';
// По умолчанию когда мы подтягиваем переводы для категории или статьи, они возвращаются нам в виде массива объектов
// этот хук преобразовывает их в объект объектов, чтобы можно было получить доступ к определенному переводу по ключу
// 
// locale: [
//   {id: 1, code: ru, name: 'russian'},
//   {id: 2, code: en, name: 'english'},
// ] - преобразовывается в 
// locale: {
//   ru: {
//     id: 1,
//     name: 'russian',
//   },
//   en: {
//     id: 1,
//     name: 'english',
//   }
// }
const modifyLocalization = (instances, options) => {
    if (!instances) {
        return Promise.resolve();
    }
    if (!Array.isArray(instances)) {
        instances = [instances];
    }
    const processInstance = (instance) => {
        if (instance.dataValues.localization) {
            const stringify = JSON.stringify(instance.dataValues.localization);
            const copy = JSON.parse(stringify);
            delete instance.dataValues.localization;
            instance.dataValues.locale = copy.reduce((acc, locale) => {
                acc[locale.language.code] = Object.assign({}, locale);
                return acc;
            }, {});
        }
        Object.values(instance.dataValues).forEach((value) => {
            if (value instanceof Model) {
                processInstance(value);
            }
        });
    };
    instances.forEach((instance) => {
        processInstance(instance);
    });
};
export default modifyLocalization;
