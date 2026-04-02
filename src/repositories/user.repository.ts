import { User } from "../types";
import { Knex } from "knex";
import db from "../database/knex";

export class UserRepository {
  private tableName = 'users';

  async create(
    userData: {
      id?: string;
      email: string;
      first_name: string;
      last_name: string;
      is_blacklisted?: boolean;
    },
    trx?: Knex.Transaction
  ): Promise<User> {
    const query = trx || db;

    const [user] = await query(this.tableName).insert(userData).returning('*');

    return user;
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<User | null> {
    const query = trx || db;

    const user = await query(this.tableName).where({ id }).first();

    return user || null;
  }

  async findByEmail(email: string, trx?: Knex.Transaction): Promise<User | null> {
    const query = trx || db;

    const user = await query(this.tableName).where({ email }).first();

    return user || null;
  }

  async updateBlacklistStatus(
    id: string,
    isBlacklisted: boolean,
    trx?: Knex.Transaction
  ): Promise<User> {
    const query = trx || db;

    const [user] = await query(this.tableName)
      .where({ id })
      .update({ is_blacklisted: isBlacklisted })
      .returning('*');

    return user;
  }

  async findAll(trx?: Knex.Transaction): Promise<User[]> {
    const query = trx || db;

    return await query(this.tableName).select('*');
  }
}