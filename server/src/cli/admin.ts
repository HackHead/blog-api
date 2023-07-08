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

    const {error} = schema.validate(str)

    if(error){ throw new Error(error.details[0].message); }

    try {
      (async () => {
        const {first_name, last_name, email, password} = str;
  
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        const full_name = `${first_name} ${last_name}`;
        await User.create({
          first_name,
          last_name,
          full_name,
          email,
          password: hashedPassword
        });
  
        console.log('Пользователь успешно создан')
      })();
    } catch (error) {
      console.log(error);
    }
  });

program.parse(process.argv);