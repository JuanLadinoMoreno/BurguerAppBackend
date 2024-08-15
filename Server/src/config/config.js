import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT;
export const NOTES_APP_MONGODB_HOST = process.env.NOTES_APP_MONGODB_HOST;
export const NOTES_APP_MONGODB_DATABASE = process.env.NOTES_APP_MONGODB_DATABASE;
export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

export const FRONTEND_URL = process.env.FRONTEND_URL;