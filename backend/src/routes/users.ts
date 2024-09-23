import { Router } from 'express';
import { UserController } from '../controllers/users.js';

const router = Router();

router.post('/users', UserController.createUser);
router.post('/users/verify-email', UserController.verifyEmail);
router.post('users/login', UserController.login);
router.get('/users/me', UserController.getMe);
router.patch('/users/me/avatar', UserController.updateAvatar);

export default router;
