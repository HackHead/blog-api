import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
   path: path.join(path.resolve(), '.env.local') 
})

export const {
    JWT_SECRET = 'SECRET',
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_DATABASE_NAME,
} = process.env;