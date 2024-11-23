import { Request, Response } from 'express';
import { HotSourceModel } from '@/models/hot';
import { Database } from 'sqlite';

let hotSourceModel: HotSourceModel;

export function initHotController(db: Database) {
  hotSourceModel = new HotSourceModel(db);
}

/**
 * 获取热搜源列表
 */
export async function getSources(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const sources = await hotSourceModel.findByUserId(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: sources
    });
  } catch (error: any) {
    console.error('Get hot sources error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 添加热搜源
 */
export async function addSource(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { name, url, icon, type, enable_preview, sort_order } = req.body;

    if (!name || !url || !icon || !type) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required fields'
      });
    }

    const source = await hotSourceModel.create({
      name,
      url,
      icon,
      type,
      enable_preview: !!enable_preview,
      sort_order
    }, userId);

    res.json({
      code: 200,
      message: 'Hot source created successfully',
      data: source
    });
  } catch (error: any) {
    console.error('Add hot source error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 更新热搜源
 */
export async function updateSource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, url, icon, type, enable_preview, sort_order } = req.body;

    if (!name || !url || !icon || !type) {
      return res.status(400).json({
        code: 400,
        message: 'Missing required fields'
      });
    }

    const source = await hotSourceModel.update(Number(id), {
      name,
      url,
      icon,
      type,
      enable_preview,
      sort_order
    }, userId);

    res.json({
      code: 200,
      message: 'Hot source updated successfully',
      data: source
    });
  } catch (error: any) {
    console.error('Update hot source error:', error);
    if (error.message === 'Hot source not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Hot source not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 删除热搜源
 */
export async function deleteSource(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await hotSourceModel.delete(Number(id), userId);

    res.json({
      code: 200,
      message: 'Hot source deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete hot source error:', error);
    if (error.message === 'Hot source not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Hot source not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
} 