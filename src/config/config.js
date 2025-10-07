import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT;
export const NOTES_APP_MONGODB_HOST = process.env.NOTES_APP_MONGODB_HOST;
export const NOTES_APP_MONGODB_DATABASE = process.env.NOTES_APP_MONGODB_DATABASE;
export const URL_MONGO_DBATLAS = process.env.URL_MONGO_DBATLAS;

export const TOKEN_SECRET = process.env.TOKEN_SECRET;

export const GMAIL_ACCOUNT = process.env.GMAIL_ACCOUNT
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD

export const FRONTEND_URL = process.env.FRONTEND_URL;

export const SK_ENV_URL = process.env.SK_ENV_URL || ''
export const SK_CLIENT_ID = process.env.SK_CLIENT_ID || ''
export const SK_CLIENT_SECRET = process.env.SK_CLIENT_SECRET || ''
export const PROTECTED_RESOURCE_METADATA = JSON.parse(process.env.PROTECTED_RESOURCE_METADATA) || {}
export const BASE_URL_MCP = process.env.BASE_URL_MCP
export const PORT_MCP = Number(process.env.PORT_MCP) || ''