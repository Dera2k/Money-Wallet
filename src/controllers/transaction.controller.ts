import { TransactionType, TransactionStatus } from "../enums/transaction.enum";
import { successResponse } from "../utils/response.util";
import { Request, Response, NextFunction } from "express";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {
  private transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.userId!;
      const { page, limit, status, type } = req.query;

      const queryOptions: {
        page?: number;
        limit?: number;
        status?: TransactionStatus;
        type?: TransactionType;
      } = {};

      if (page) queryOptions.page = parseInt(page as string, 10);
      if (limit) queryOptions.limit = parseInt(limit as string, 10);
      if (status) queryOptions.status = status as TransactionStatus;
      if (type) queryOptions.type = type as TransactionType;

      const result = await this.transactionService.getTransactionsByUserId(userId, queryOptions);

      res.status(200).json(
        successResponse("Transactions retrieved successfully", {
          transactions: result.transactions,
          pagination: {
            total: result.total,
            page: result.page,
            limit: result.limit,
            pages: Math.ceil(result.total / result.limit),
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const transactionId = req.params.transactionId as string;
      const transaction = await this.transactionService.getTransactionById(transactionId);

      res.status(200).json(
        successResponse("Transaction retrieved successfully", {
          transaction,
        })
      );
    } catch (error) {
      next(error);
    }
  };
}