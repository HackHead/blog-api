var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { program } from "commander";
import User from "../models/User.js";
import Joi from "joi";
import { genSalt, hash } from "bcrypt";
program.command('create')
    .description('Split a string into substrings and display as an array')
    .option('--first_name <first_name>', 'First name')
    .option('--last_name <last_name>', 'Last name')
    .option('--email <email>', 'Email')
    .option('--password <password>', 'Password')
    .action((str, options) => {
    const schema = Joi.object({
        first_name: Joi.string().required().min(2),
        last_name: Joi.string().required().min(2),
        email: Joi.string().required().min(2).email(),
        password: Joi.string().required().min(2),
    });
    const { error } = schema.validate(str);
    if (error) {
        throw new Error(error.details[0].message);
    }
    try {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const { first_name, last_name, email, password } = str;
            const salt = yield genSalt(10);
            const hashedPassword = yield hash(password, salt);
            const full_name = `${first_name} ${last_name}`;
            yield User.create({
                first_name,
                last_name,
                full_name,
                email,
                password: hashedPassword
            });
            console.log('Пользователь успешно создан');
        }))();
    }
    catch (error) {
        console.log(error);
    }
});
program.parse(process.argv);
