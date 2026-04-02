import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { TransactionController } from '../controllers/transaction.controller';

const router: Router = Router();const transactionController = new TransactionController();

//transaction routes require authentication
router.use(authenticate);

router.get('/', transactionController.getTransactions);
router.get('/:transactionId', transactionController.getTransaction);

export default router;