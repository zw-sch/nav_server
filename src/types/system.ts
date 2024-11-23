export interface SystemConfig {
  id: number;
  site_title: string;
  icp_record: string | null;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface SystemConfigUpdateRequest {
  site_title?: string;
  icp_record?: string;
} 