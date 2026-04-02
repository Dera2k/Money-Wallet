import { Transaction } from '../types';
import { NotFoundError } from '../utils/errors.util';
import { TransactionStatus, TransactionType } from '../enums/transaction.enum';
import { TransactionRepository } from '../repositories/transaction.repository';
import { WalletRepository } from '../repositories/wallet.repository';

export class TransactionService {
  private transactionRepo = new TransactionRepository();
  private walletRepo = new WalletRepository();

  async getTransactionsByUserId(
    userId: string,
    options?: {
      page?: number;
      limit?: number;
      status?: TransactionStatus;
      type?: TransactionType;
    }
  ): Promise<{
    transactions: Transaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const wallet = await this.walletRepo.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    const result = await this.transactionRepo.findByWalletId(wallet.id, options);

    return {
      ...result,
      page: options?.page || 1,
      limit: options?.limit || 20,
    };
  }

  async getTransactionById(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionRepo.findById(transactionId);

    if (!transaction) {
      throw new NotFoundError('Transaction not found');
    }

    return transaction;
  }
}