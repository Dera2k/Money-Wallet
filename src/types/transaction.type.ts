import { TransactionType, TransactionStatus } from "../enums/index.enum";
export interface Transaction{
    id: string;
    type: TransactionType;
    amount: string;
    status: TransactionStatus;
    reference: string;
    sender_wallet_id: string | null;
    receiver_wallet_id: string;
    created_at: Date;
}

export interface CreateTransactionDto{
    type : TransactionType;
    amount: number;
    reference: string;
    sender_wallet_id: string | null;
    receiver_wallet_id: string;
}

export interface FundWalletDTO {
  amount: number;
  reference: string;
}

export interface TransferDTO {
  toUserId: string;
  amount: number;
  reference: string;
}

export interface WithdrawDTO {
  amount: number;
  reference: string;
}