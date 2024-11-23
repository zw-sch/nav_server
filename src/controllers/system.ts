import { Request, Response } from 'express';
import { SystemConfigModel } from '@/models/system';
import { Database } from 'sqlite';

let systemConfigModel: SystemConfigModel;

export function initSystemController(db: Database) {
  systemConfigModel = new SystemConfigModel(db);
}

export async function getSystemConfig(req: Request, res: Response) {
  try {
    // 默认使用ID为1的用户的配置
    const config = await systemConfigModel.getConfig(1);
    
    if (!config) {
      return res.json({
        code: 200,
        data: {
          site_title: 'Home Nav',
          icp_record: null
        }
      });
    }

    res.json({
      code: 200,
      data: {
        site_title: config.site_title,
        icp_record: config.icp_record
      }
    });
  } catch (error) {
    console.error('Get system config error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
}

export async function updateSystemConfig(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const { site_title, icp_record } = req.body;

    const config = await systemConfigModel.update(userId, {
      site_title,
      icp_record
    });

    res.json({
      code: 200,
      message: '更新成功',
      data: {
        site_title: config.site_title,
        icp_record: config.icp_record
      }
    });
  } catch (error) {
    console.error('Update system config error:', error);
    res.status(500).json({
      code: 500,
      message: '服务器内部错误'
    });
  }
} 