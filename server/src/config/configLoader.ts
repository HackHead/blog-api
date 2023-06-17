import { load, path } from "../deps.ts"

const {
    JWT_TOKEN,
} = await load({
    envPath: path.join(path.resolve(), '.env.local')
});

const API_VERSION = 'v1'

export {
    JWT_TOKEN,
    API_VERSION,
};