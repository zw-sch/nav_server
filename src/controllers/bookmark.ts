import { Request, Response } from 'express';
import { BookmarkModel } from '@/models/bookmark';
import { CategoryModel } from '@/models/category';
import { Database } from 'sqlite';

let bookmarkModel: BookmarkModel;
let categoryModel: CategoryModel;

export function initBookmarkController(db: Database) {
  bookmarkModel = new BookmarkModel(db);
  categoryModel = new CategoryModel(db);
}

/**
 * 获取分类列表
 */
export async function getCategories(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const categories = await categoryModel.findByUserId(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: categories
    });
  } catch (error: any) {
    console.error('Get categories error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 添加分类
 */
export async function addCategory(req: Request, res: Response) {
  try {
    const { name, icon, sort_order } = req.body;
    const userId = req.user!.id;

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: 'Category name is required'
      });
    }

    const category = await categoryModel.create(name, userId, icon, { sort_order });

    res.json({
      code: 200,
      message: 'Category created successfully',
      data: category
    });
  } catch (error: any) {
    console.error('Add category error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 获取书签列表
 */
export async function getBookmarks(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const bookmarks = await bookmarkModel.findByUserId(userId);

    res.json({
      code: 200,
      message: 'Success',
      data: bookmarks
    });
  } catch (error: any) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 添加书签
 */
export async function addBookmark(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { name, categoryId, internalUrl, externalUrl, icon, remark, sort_order } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        code: 400,
        message: 'Name and category ID are required'
      });
    }

    const bookmark = await bookmarkModel.create({
      name,
      categoryId,
      internalUrl,
      externalUrl,
      icon,
      remark,
      sort_order
    }, userId);

    res.json({
      code: 200,
      message: 'Bookmark created successfully',
      data: bookmark
    });
  } catch (error: any) {
    console.error('Add bookmark error:', error);
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 更新分类
 */
export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, icon, sort_order } = req.body;

    if (!name) {
      return res.status(400).json({
        code: 400,
        message: 'Category name is required'
      });
    }

    const category = await categoryModel.update(
      Number(id), 
      name, 
      icon, 
      userId,
      { sort_order }
    );

    res.json({
      code: 200,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error: any) {
    console.error('Update category error:', error);
    if (error.message === 'Category not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Category not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 更新书签
 */
export async function updateBookmark(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;
    const { name, categoryId, internalUrl, externalUrl, icon, remark, sort_order } = req.body;

    if (!name || !categoryId) {
      return res.status(400).json({
        code: 400,
        message: 'Name and category ID are required'
      });
    }

    const bookmark = await bookmarkModel.update(Number(id), {
      name,
      categoryId,
      internalUrl,
      externalUrl,
      icon,
      remark,
      sort_order
    }, userId);

    res.json({
      code: 200,
      message: 'Bookmark updated successfully',
      data: bookmark
    });
  } catch (error: any) {
    console.error('Update bookmark error:', error);
    if (error.message === 'Bookmark not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Bookmark not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 删除分类
 */
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // 检查是否存在关联的书签
    const bookmarks = await bookmarkModel.findByCategoryId(Number(id), userId);
    if (bookmarks.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '该分类下存在书签，请先删除书签'
      });
    }

    await categoryModel.delete(Number(id), userId);

    res.json({
      code: 200,
      message: 'Category deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete category error:', error);
    if (error.message === 'Category not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Category not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}

/**
 * 删除书签
 */
export async function deleteBookmark(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    await bookmarkModel.delete(Number(id), userId);

    res.json({
      code: 200,
      message: 'Bookmark deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete bookmark error:', error);
    if (error.message === 'Bookmark not found or unauthorized') {
      return res.status(404).json({
        code: 404,
        message: 'Bookmark not found or unauthorized'
      });
    }
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    });
  }
}