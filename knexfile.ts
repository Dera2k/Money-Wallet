import type { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

//finction to validate env variables exist
function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: getEnv('DB_HOST'),
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: getEnv('DB_USER'),
      password: process.env.DB_PASSWORD || '',
      database: getEnv('DB_NAME'),
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    seeds: {
      directory: './src/database/seeds',
      extension: 'ts',
    },
  },

  production: {
    client: 'mysql2',
    connection: {
      host: getEnv('DB_HOST'),
      port: parseInt(process.env.DB_PORT || '3306', 10),
      user: getEnv('DB_USER'),
      password: process.env.DB_PASSWORD || '',
      database: getEnv('DB_NAME'),
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'ts',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};

export default config;