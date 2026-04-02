import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticate,} from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../validators/user.validator";

const router: Router = Router();const userController = new UserController();

//public routes
router.post('/register', validate(registerSchema), userController.register);
router.post('/login', validate(loginSchema), userController.login);
//protected route
router.get('/:userId', authenticate, userController.getUser);

export default router;