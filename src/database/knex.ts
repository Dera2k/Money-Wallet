import knex from 'knex';
import config from '../config';
import type { Knex } from 'knex';

const knexConfig: Knex.Config = {
  client: 'mysql2',
  connection: {
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.password,
    database: config.database.name,
  },

  migrations: {
    directory: './src/database/migrations',
    extension: 'ts',
  },
  seeds: {
    directory: './src/database/seeds',
    extension: 'ts',
  },
};

const db = knex(knexConfig);
export default db;