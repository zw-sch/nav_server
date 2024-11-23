import { Router } from 'express';
import { RequestHandler } from 'express';
import * as weatherController from '@/controllers/weather';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware as RequestHandler);

/**
 * 获取当前天气
 * GET /api/weather/current
 */
router.get('/current', weatherController.getCurrentWeather as RequestHandler);

export default router; 