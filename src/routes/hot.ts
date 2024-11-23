import { Router } from 'express';
import { RequestHandler } from 'express';
import * as hotController from '@/controllers/hot';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware as RequestHandler);

/**
 * 获取热搜源列表
 * GET /api/hot/sources
 */
router.get('/sources', hotController.getSources as RequestHandler);

/**
 * 添加热搜源
 * POST /api/hot/sources
 */
router.post('/sources', hotController.addSource as RequestHandler);

/**
 * 更新热搜源
 * PUT /api/hot/sources/:id
 */
router.put('/sources/:id', hotController.updateSource as RequestHandler);

/**
 * 删除热搜源
 * DELETE /api/hot/sources/:id
 */
router.delete('/sources/:id', hotController.deleteSource as RequestHandler);

export default router; 