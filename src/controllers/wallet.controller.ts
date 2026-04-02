import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/response.util";
import { WalletService } from "../services/wallet.service";

export class WalletController {
  private walletService: WalletService;

  constructor() {
    this.walletService = new WalletService();
  }

  getWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;

      const wallet = await this.walletService.getWalletByUserId(userId);

      res.status(200).json(
        successResponse('Wallet retrieved successfully', {
          wallet: {
            id: wallet.id,
            userId: wallet.user_id,
            balance: wallet.balance,
            createdAt: wallet.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  fundWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const { amount, reference } = req.body;

      const transaction = await this.walletService.fundWallet(userId, amount, reference);

      res.status(200).json(
        successResponse('Wallet funded successfully', {
          transaction: {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            reference: transaction.reference,
            createdAt: transaction.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  transfer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const fromUserId = req.userId!;
      const { toUserId, amount, reference } = req.body;

      const transaction = await this.walletService.transfer(
        fromUserId,
        toUserId,
        amount,
        reference
      );

      res.status(200).json(
        successResponse('Transfer successful', {
          transaction: {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            reference: transaction.reference,
            createdAt: transaction.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  withdraw = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const { amount, reference } = req.body;

      const transaction = await this.walletService.withdraw(userId, amount, reference);

      res.status(200).json(
        successResponse('Withdrawal successful', {
          transaction: {
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            status: transaction.status,
            reference: transaction.reference,
            createdAt: transaction.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };
}