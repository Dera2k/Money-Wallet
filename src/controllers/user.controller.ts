import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { successResponse } from '../utils/response.util';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, firstName, lastName } = req.body;

      const { user, token } = await this.userService.register({
        email,
        firstName,
        lastName,
      });

      res.status(201).json(
        successResponse('User registered successfully', {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
          },
          token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const { user, token } = await this.userService.login(email);

      res.status(200).json(
        successResponse('Login successful', {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
          },
          token,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId  = req.params.userId as string;
      const user = await this.userService.getUserById(userId);

      res.status(200).json(
        successResponse('User retrieved successfully', {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            isBlacklisted: user.is_blacklisted,
            createdAt: user.created_at,
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };
}