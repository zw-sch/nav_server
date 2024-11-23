import { Router } from 'express';
import { RequestHandler } from 'express';
import * as searchController from '@/controllers/search';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware as RequestHandler);

/**
 * 获取搜索引擎列表
 * GET /api/search/engines
 */
router.get('/engines', searchController.getEngines as RequestHandler);

/**
 * 添加搜索引擎
 * POST /api/search/engines
 */
router.post('/engines', searchController.addEngine as RequestHandler);

/**
 * 更新搜索引擎
 * PUT /api/search/engines/:id
 */
router.put('/engines/:id', searchController.updateEngine as RequestHandler);

/**
 * 删除搜索引擎
 * DELETE /api/search/engines/:id
 */
router.delete('/engines/:id', searchController.deleteEngine as RequestHandler);

export default router; 