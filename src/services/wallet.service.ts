import db from "../database/knex";
import { WalletRepository } from "../repositories/wallet.repository";
import { TransactionRepository } from "../repositories/transaction.repository";
import { TransactionStatus, TransactionType } from "../enums/transaction.enum";
import { toDecimal, isValidAmount,} from "../utils/money.util";
import { NotFoundError, InsufficientBalanceError, ValidationError } from "../utils/errors.util";
import { Wallet, Transaction } from "../types";

export class WalletService {
  private walletRepo = new WalletRepository();
  private transactionRepo = new TransactionRepository();

  async getWalletByUserId(userId: string): Promise<Wallet> {
    const wallet = await this.walletRepo.findByUserId(userId);

    if (!wallet) {
      throw new NotFoundError('Wallet not found');
    }

    return wallet;
  }

  async fundWallet(
    userId: string,
    amount: number,
    reference: string
  ): Promise<Transaction> {
    // Idempotency check
    const existing = await this.transactionRepo.findByReference(reference);
    if (existing) return existing;

    // Validate amount
    if (!isValidAmount(amount)) {
      throw new ValidationError('Invalid amount');
    }

    return await db.transaction(async (trx) => {
      const wallet = await this.walletRepo.findByUserIdWithLock(userId, trx);

      if (!wallet) {
        throw new NotFoundError('Wallet not found');
      }

      const amountStr = toDecimal(amount);

      //update balance in MySQL
      await this.walletRepo.incrementBalance(wallet.id, amountStr, trx);

      //record transaction
      return await this.transactionRepo.create(
        {
          type: TransactionType.FUND,
          amount: amountStr,
          status: TransactionStatus.SUCCESS,
          reference,
          receiver_wallet_id: wallet.id,
        },
        trx
      );
    });
  }

  async transfer(
    fromUserId: string,
    toUserId: string,
    amount: number,
    reference: string
  ): Promise<Transaction> {
    //idempotency check
    const existing = await this.transactionRepo.findByReference(reference);
    if (existing) return existing;

    //validate
    if (!isValidAmount(amount)) {
      throw new ValidationError('Invalid amount');
    }

    if (fromUserId === toUserId) {
      throw new ValidationError('Cannot transfer to yourself');
    }

    return await db.transaction(async (trx) => {
      //lock both wallets
      const senderWallet = await this.walletRepo.findByUserIdWithLock(fromUserId, trx);
      const receiverWallet = await this.walletRepo.findByUserIdWithLock(toUserId, trx);

      if (!senderWallet) {
        throw new NotFoundError('Sender wallet not found');
      }

      if (!receiverWallet) {
        throw new NotFoundError('Receiver wallet not found');
      }

      const amountStr = toDecimal(amount);

      //check balance
      if (parseFloat(senderWallet.balance) < amount) {
        throw new InsufficientBalanceError('Insufficient balance');
      }

      //update balances in MySQL
      await this.walletRepo.decrementBalance(senderWallet.id, amountStr, trx);
      await this.walletRepo.incrementBalance(receiverWallet.id, amountStr, trx);

      //record transaction
      return await this.transactionRepo.create(
        {
          type: TransactionType.TRANSFER,
          amount: amountStr,
          status: TransactionStatus.SUCCESS,
          reference,
          sender_wallet_id: senderWallet.id,
          receiver_wallet_id: receiverWallet.id,
        },
        trx
      );
    });
  }

  async withdraw(
    userId: string,
    amount: number,
    reference: string
  ): Promise<Transaction> {
    //idempotency check
    const existing = await this.transactionRepo.findByReference(reference);
    if (existing) return existing;

    //validate
    if (!isValidAmount(amount)) {
      throw new ValidationError('Invalid amount');
    }

    return await db.transaction(async (trx) => {
      const wallet = await this.walletRepo.findByUserIdWithLock(userId, trx);

      if (!wallet) {
        throw new NotFoundError('Wallet not found');
      }

      const amountStr = toDecimal(amount);

      //check balance
      if (parseFloat(wallet.balance) < amount) {
        throw new InsufficientBalanceError('Insufficient balance');
      }

      //update balance in MySQL
      await this.walletRepo.decrementBalance(wallet.id, amountStr, trx);

      //record transaction
      return await this.transactionRepo.create(
        {
          type: TransactionType.WITHDRAW,
          amount: amountStr,
          status: TransactionStatus.SUCCESS,
          reference,
          sender_wallet_id: wallet.id,
          receiver_wallet_id: wallet.id,
        },
        trx
      );
    });
  }
}