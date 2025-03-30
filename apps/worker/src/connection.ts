import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set default values if environment variables are not available
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379;
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || undefined;

export const connection = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD === '' ? undefined : REDIS_PASSWORD,
};

// Log connection details (omit password for security)
console.log(`[Redis] Connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);