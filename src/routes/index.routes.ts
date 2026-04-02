import { Router } from 'express';
import userRoutes from './user.routes';
import walletRoutes from './wallet.routes';
import transactionRoutes from './transaction.routes';

const router: Router = Router();
router.use('/users', userRoutes);
router.use('/wallet', walletRoutes);
router.use('/transactions', transactionRoutes);

export default router;