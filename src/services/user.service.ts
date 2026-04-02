import db from '../database/knex';
import { AdjutorService } from './adjutor.service';
import { User } from '../types';
import { generateToken } from '../utils/jwt.utility';
import { ConflictError, NotFoundError } from '../utils/errors.util';
import { UserRepository } from '../repositories/user.repository';
import { WalletRepository } from '../repositories/wallet.repository';

export class UserService {
  private userRepo = new UserRepository();
  private walletRepo = new WalletRepository();
  private adjutorService = new AdjutorService();

  async register(data: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<{ user: User; token: string }> {
    //check email uniqueness
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered', 'DUPLICATE_EMAIL');
    }

    // Check blacklist
    const isBlacklisted = await this.adjutorService.checkBlacklist(data.email);
    if (isBlacklisted) {
      throw new ConflictError('User is blacklisted', 'BLACKLISTED_USER');
    }

    // Create user and wallet atomically
    const user = await db.transaction(async (trx) => {
      const newUser = await this.userRepo.create(
        {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          is_blacklisted: false,
        },
        trx
      );

      await this.walletRepo.create(
        {
          user_id: newUser.id,
          balance: '0.00',
        },
        trx
      );

      return newUser;
    });

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async login(email: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.is_blacklisted) {
      throw new ConflictError('User is blacklisted', 'BLACKLISTED_USER');
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return { user, token };
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }
}