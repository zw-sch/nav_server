import { Request, Response } from 'express';
import { SearchEngineModel } from '@/models/search';
import { Database } from 'sqlite';

let searchEngineModel: SearchEngineModel;

export function initSearchController(db: Database) {
  searchEngineModel = new SearchEngineModel(db);
}

/**
 * 获取搜索引擎列表
 */
export async function getEngines(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const engines = await searchEngineModel.findByUserId(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: engines
    });
  } catch (error: any) {
    console.error('Get search engines error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 添加搜索引擎
 */
export async function addEngine(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { name, url, searchUrl, icon, sortOrder, quickCommand } = req.body;

    // 验证必填字段
    if (!name || !searchUrl || !icon) {
      return res.status(400).json({
        code: 400,
        message: '名称、搜索URL和图标为必填项'
      });
    }

    const engine = await searchEngineModel.create({
      name,
      url,
      searchUrl,
      icon,
      sortOrder,
      quickCommand
    }, userId);

    res.json({
      code: 200,
      message: 'Search engine created successfully',
      data: engine
    });
  } catch (error: any) {
    console.error('Add search engine error:', error);
    if (error.message.includes('快速命令')) {
      return res.status(400).json({
        code: 400,
        message: error.message
      });
    }
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}

/**
 * 更新搜索引擎
 */
export async function updateEngine(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, url, searchUrl, icon, sortOrder, quickCommand } = req.body;

    // 验证必填字段
    if (!name || !searchUrl || !icon) {
      return res.status(400).json({
        code: 400,
        message: '名称、搜索URL和图标为必填项'
      });
    }

    const engine = await searchEngineModel.update(Number(id), {
      name,
      url,
      searchUrl,
      icon,
      sortOrder,
      quickCommand
    }, userId);

    res.json({
      code: 200,
      message: 'Search engine updated successfully',
      data: engine
    });
  } catch (error: any) {
    console.error('Update search engine error:', error);
    if (error.message.includes('快速命令')) {
      return res.status(400).json({
        code: 400,
        message: error.message
      });
    }
    if (error.message === '搜索引擎不存在或无权操作') {
      return res.status(404).json({
        code: 404,
        message: '搜索引擎不存在或无权操作'
      });
    }
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}

/**
 * 删除搜索引擎
 */
export async function deleteEngine(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await searchEngineModel.delete(Number(id), userId);

    res.json({
      code: 200,
      message: '搜索引擎删除成功'
    });
  } catch (error: any) {
    console.error('Delete search engine error:', error);
    if (error.message === '搜索引擎不存在或无权操作') {
      return res.status(404).json({
        code: 404,
        message: '搜索引擎不存在或无权操作'
      });
    }
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
} 