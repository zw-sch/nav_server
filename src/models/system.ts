import { Database } from 'sqlite';
import { SystemConfig, SystemConfigUpdateRequest } from '@/types/system';

export class SystemConfigModel {
  constructor(private db: Database) {}

  async getConfig(userId: number): Promise<SystemConfig | undefined> {
    return this.db.get<SystemConfig>(
      'SELECT * FROM system_configs WHERE user_id = ?',
      userId
    );
  }

  async update(userId: number, data: SystemConfigUpdateRequest): Promise<SystemConfig> {
    const config = await this.getConfig(userId);
    
    if (!config) {
      // 如果不存在配置则创建
      await this.db.run(
        `INSERT INTO system_configs (site_title, icp_record, user_id) 
         VALUES (?, ?, ?)`,
        data.site_title || 'Home Nav',
        data.icp_record || null,
        userId
      );
      return this.getConfig(userId) as Promise<SystemConfig>;
    }

    // 更新现有配置
    const updates: string[] = [];
    const values: any[] = [];

    if (data.site_title !== undefined) {
      updates.push('site_title = ?');
      values.push(data.site_title);
    }
    if (data.icp_record !== undefined) {
      updates.push('icp_record = ?');
      values.push(data.icp_record);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(userId);

      await this.db.run(
        `UPDATE system_configs 
         SET ${updates.join(', ')} 
         WHERE user_id = ?`,
        ...values
      );
    }

    return this.getConfig(userId) as Promise<SystemConfig>;
  }
} 