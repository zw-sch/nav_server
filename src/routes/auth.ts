import { Router } from 'express';
import { RequestHandler } from 'express';
import * as authController from '@/controllers/auth';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

/**
 * 用户注册路由
 * POST /api/auth/register
 */
router.post('/register', authController.register as RequestHandler);

/**
 * 用户登录路由
 * POST /api/auth/login
 */
router.post('/login', authController.login as RequestHandler);

/**
 * 需要认证的路由
 */
router.use(authMiddleware as RequestHandler);
router.get('/user', authController.getUserInfo as RequestHandler);
router.put('/user', authController.updateUserInfo as RequestHandler);

export default router; 