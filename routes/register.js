import express from 'express';
import { registerController } from '../controllers/index';
import { loginController } from '../controllers';

let router  = express.Router();

router.post('/register' , registerController.resolveReq);

router.post('/login', loginController.login);

export default router;