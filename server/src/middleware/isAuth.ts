import { Context, Next } from "../deps.ts";

const isAuth = async ({request, response}: Context, next: Next) => {
    
    await next();
};

export default isAuth;