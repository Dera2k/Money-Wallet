export interface Wallet {
    id: string;
    user_id: string;
    balance: string;
    created_at: Date
}

export interface WalletWithUser extends Wallet {
    user: {
        email: string;
        first_name: string;
        last_name: string;
    };
}