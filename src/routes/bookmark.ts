import { Router } from 'express';
import { RequestHandler } from 'express';
import * as bookmarkController from '@/controllers/bookmark';
import { authMiddleware } from '@/middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware as RequestHandler);

/**
 * 获取分类列表
 * GET /api/bookmarks/categories
 */
router.get('/categories', bookmarkController.getCategories as RequestHandler);

/**
 * 添加分类
 * POST /api/bookmarks/categories
 */
router.post('/categories', bookmarkController.addCategory as RequestHandler);

/**
 * 更新分类
 * PUT /api/bookmarks/categories/:id
 */
router.put('/categories/:id', bookmarkController.updateCategory as RequestHandler);

/**
 * 删除分类
 * DELETE /api/bookmarks/categories/:id
 */
router.delete('/categories/:id', bookmarkController.deleteCategory as RequestHandler);

/**
 * 获取书签列表
 * GET /api/bookmarks
 */
router.get('/', bookmarkController.getBookmarks as RequestHandler);

/**
 * 添加书签
 * POST /api/bookmarks
 */
router.post('/', bookmarkController.addBookmark as RequestHandler);

/**
 * 更新书签
 * PUT /api/bookmarks/:id
 */
router.put('/:id', bookmarkController.updateBookmark as RequestHandler);

/**
 * 删除书签
 * DELETE /api/bookmarks/:id
 */
router.delete('/:id', bookmarkController.deleteBookmark as RequestHandler);

export default router; 