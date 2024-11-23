import { Router } from 'express';
import { RequestHandler } from 'express';
import * as systemController from '@/controllers/system';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// 公开路由
router.get('/config', systemController.getSystemConfig as RequestHandler);

// 需要认证的路由
router.use(authMiddleware as RequestHandler);
router.put('/config', systemController.updateSystemConfig as RequestHandler);

export default router; 