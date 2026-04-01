import { Knex } from "knex";
import { Wallet } from "../types";
import db from "../database/knex";

export class WalletRepository {
  private tableName = 'wallets';

  private getQuery(trx?: Knex.Transaction) {
    return trx || db;
  }

  async create(walletData: Partial<Wallet>, trx?: Knex.Transaction): Promise<Wallet> {
    const query = this.getQuery(trx);
    const [wallet] = await query(this.tableName).insert(walletData).returning('*');
    return wallet;
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<Wallet | null> {
    const query = this.getQuery(trx);
    return (await query(this.tableName).where({ id }).first()) || null;
  }

  async findByUserId(userId: string, trx?: Knex.Transaction): Promise<Wallet | null> {
    const query = this.getQuery(trx);
    return (await query(this.tableName).where({ user_id: userId }).first()) || null;
  }

  async findByIdWithLock(id: string, trx: Knex.Transaction): Promise<Wallet | null> {
    return (await trx(this.tableName).where({ id }).forUpdate().first()) || null;
  }

  async findByUserIdWithLock(userId: string, trx: Knex.Transaction): Promise<Wallet | null> {
    return (await trx(this.tableName).where({ user_id: userId }).forUpdate().first()) || null;
  }

  async updateBalance(id: string, newBalance: string, trx?: Knex.Transaction): Promise<Wallet> {
    const query = this.getQuery(trx);
    const [wallet] = await query(this.tableName).where({ id }).update({ balance: newBalance }).returning('*');
    return wallet;
  }

  async incrementBalance(id: string, amount: string, trx?: Knex.Transaction): Promise<Wallet> {
    const query = this.getQuery(trx);
    const [wallet] = await query(this.tableName)
    .where({ id })
    .update({
      balance: query.raw('balance + ?', [amount])
    })
    .returning('*');
  return wallet;
  }

  async decrementBalance(id: string, amount: string, trx?: Knex.Transaction): Promise<Wallet> {
  const query = this.getQuery(trx);
  const [wallet] = await query(this.tableName)
    .where({ id })
    .update({
      balance: query.raw('balance - ?', [amount])
    })
    .returning('*');
  return wallet;
  }
}