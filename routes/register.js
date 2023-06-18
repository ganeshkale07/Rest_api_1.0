import express from 'express';
import { registerController, loginController, userController} from '../controllers/index';
import auth from "../middlewares/auth";

let router  = express.Router();

router.post('/register' , registerController.resolveReq);

router.post('/login', loginController.login);

router.get('/me', auth, userController.me);

export default router;