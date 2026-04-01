import { Knex } from "knex";
import db from "../database/knex";
import { Transaction, CreateTransactionDto } from "../types";
import { TransactionType, TransactionStatus } from "../enums/transaction.enum";

export class TransactionRepository {
  private tableName = 'transactions';

  private getQuery(trx?: Knex.Transaction) {
    return trx || db;
  }

  private async paginate(
    queryBuilder: Knex.QueryBuilder,
    page = 1,
    limit = 20
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const offset = (page - 1) * limit;
    const [transactions, countResult] = await Promise.all([
      queryBuilder.clone().orderBy('created_at', 'desc').limit(limit).offset(offset),
      queryBuilder.clone().count('* as count').first(),
    ]);
    return { transactions, total: Number(countResult?.count || 0) };
  }

  async create(transactionData: Partial<Transaction>, trx?: Knex.Transaction): Promise<Transaction> {
    const query = this.getQuery(trx);
    const [transaction] = await query(this.tableName).insert(transactionData).returning('*');
    return transaction;
  }

  async findById(id: string, trx?: Knex.Transaction): Promise<Transaction | null> {
    const query = this.getQuery(trx);
    return (await query(this.tableName).where({ id }).first()) || null;
  }

  async findByReference(reference: string, trx?: Knex.Transaction): Promise<Transaction | null> {
    const query = this.getQuery(trx);
    return (await query(this.tableName).where({ reference }).first()) || null;
  }

  async findByWalletId(
    walletId: string,
    options?: { page?: number; limit?: number; status?: TransactionStatus; type?: TransactionType },
    trx?: Knex.Transaction
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const query = this.getQuery(trx);
    const { page = 1, limit = 20, status, type } = options || {};
    let qb = query(this.tableName).where('sender_wallet_id', walletId).orWhere('receiver_wallet_id', walletId);
    if (status) qb = qb.andWhere({ status });
    if (type) qb = qb.andWhere({ type });
    return this.paginate(qb, page, limit);
  }

  async updateStatus(id: string, status: TransactionStatus, trx?: Knex.Transaction): Promise<Transaction> {
    const query = this.getQuery(trx);
    const [transaction] = await query(this.tableName).where({ id }).update({ status }).returning('*');
    return transaction;
  }

  async findAll(
    options?: { page?: number; limit?: number; status?: TransactionStatus; type?: TransactionType },
    trx?: Knex.Transaction
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const query = this.getQuery(trx);
    const { page = 1, limit = 20, status, type } = options || {};
    let qb = query(this.tableName);
    if (status) qb = qb.where({ status });
    if (type) qb = qb.where({ type });
    return this.paginate(qb, page, limit);
  }
}