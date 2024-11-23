// 用户相关接口定义
export interface User {
  id: number;
  username: string;
  password: string;
  avatar?: string;
  weather_adcode?: string;
  weather_key?: string;
  container_config?: string;
  created_at: string;
  updated_at: string;
}

// JWT负载接口定义
export interface JwtPayload {
  id: number;
  username: string;
}

// 通用响应接口
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 请求中的用户信息
export interface RequestUser {
  id: number;
  username: string;
}

// 扩展 Express 的 Request 接口
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

// 书签分类接口
export interface BookmarkCategory {
  id: number;
  name: string;
  icon?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// 书签接口
export interface Bookmark {
  id: number;
  name: string;
  category_id: number;
  icon?: string;
  remark?: string;
  internal_url: string;
  external_url: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// 书签分类请求
export interface CategoryRequest {
  name: string;
  icon?: string;
}

// 书签请求
export interface BookmarkRequest {
  name: string;
  categoryId: number;
  icon?: string;
  remark?: string;
  internalUrl: string;
  externalUrl: string;
}

// 搜索引擎接口
export interface SearchEngine {
  id: number;
  name: string;
  url?: string;
  search_url: string;
  icon: string;
  sort_order: number;
  quick_command?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// 搜索引擎请求
export interface SearchEngineRequest {
  name: string;
  url?: string;
  searchUrl: string;
  icon: string;
  sortOrder?: number;
  quickCommand?: string;
}

// 容器配置接口
export interface ContainerConfig {
  showWeather: boolean;
  showHotSearch: boolean;
  showBookmark: boolean;
}

// 用户信息更新请求
export interface UserUpdateRequest {
  avatar?: string;
  weather_adcode?: string;
  weather_key?: string;
  container_config?: ContainerConfig;
}

// 热搜源接口
export interface HotSource {
  id: number;
  name: string;
  url: string;
  icon: string;
  type: string;
  enable_preview: boolean;
  user_id: number;
  created_at: string;
  updated_at: string;
}

// 热搜源请求接口
export interface HotSourceRequest {
  name: string;
  url: string;
  icon: string;
  type: string;
  enable_preview: boolean;
}

// 热搜数据项接口
export interface HotDataItem {
  title: string;
  desc?: string;
  url: string;
  mobileUrl?: string;
}

// 热搜数据响应接口
export interface HotData {
  name: string;
  title: string;
  subtitle?: string;
  from: string;
  total: number;
  updateTime: string;
  data: HotDataItem[];
} 