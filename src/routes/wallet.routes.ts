import { Router } from 'express';

import { WalletController } from '../controllers/wallet.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { fundWalletSchema, transferSchema, withdrawSchema } from '../validators/wallet.validator';

const router: Router = Router();
const walletController = new WalletController();

//wallet routes require authentication
router.use(authenticate);

router.get('/', walletController.getWallet);
router.post('/fund', validate(fundWalletSchema), walletController.fundWallet);
router.post('/transfer', validate(transferSchema), walletController.transfer);
router.post('/withdraw', validate(withdrawSchema), walletController.withdraw);

export default router;