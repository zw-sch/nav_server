import { Request, Response } from 'express';
import { UserModel } from '@/models/user';
import axios, { AxiosError } from 'axios';
import { Database } from 'sqlite';

let userModel: UserModel;

export function initWeatherController(db: Database) {
  userModel = new UserModel(db);
}

interface WeatherResponse {
  status: string;
  info: string;
  infocode: string;
  lives?: {
    province: string;
    city: string;
    weather: string;
    temperature: string;
    winddirection: string;
    windpower: string;
    humidity: string;
    reporttime: string;
  }[];
}

/**
 * 获取当前天气
 */
export async function getCurrentWeather(req: Request, res: Response) {
  try {
    const userId = req.user!.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在'
      });
    }

    if (!user.weather_adcode || !user.weather_key) {
      return res.status(400).json({
        code: 400,
        message: '请先配置天气参数'
      });
    }

    try {
      // 调用高德天气API
      const response = await axios.get<WeatherResponse>(
        'https://restapi.amap.com/v3/weather/weatherInfo',
        {
          params: {
            key: user.weather_key,
            city: user.weather_adcode,
            extensions: 'base'
          }
        }
      );

      // 检查API响应状态
      if (response.data.status !== '1') {
        // 根据高德地图API的错误码返回对应的错误信息
        const errorMessages: { [key: string]: string } = {
          '201': '缺少必要的请求参数',
          '202': '请求参数非法',
          '203': '请求服务不存在',
          '204': '请求失败',
          '205': '请求方式有误',
          '206': '请求服务响应失败',
          '207': '无权限访问此服务',
          'INVALID_USER_KEY': '用户key不正确或过期',
          'DAILY_QUERY_OVER_LIMIT': '访问已超出日访问量',
          'ACCESS_TOO_FREQUENT': '访问过于频繁',
        };

        const errorMessage = errorMessages[response.data.infocode] || response.data.info;
        throw new Error(errorMessage);
      }

      // 确保有天气数据
      if (!response.data.lives || response.data.lives.length === 0) {
        throw new Error('无法获取天气数据');
      }

      const weatherData = response.data.lives[0];

      res.json({
        code: 200,
        data: {
          province: weatherData.province,
          city: weatherData.city,
          weather: weatherData.weather,
          temperature: weatherData.temperature,
          winddirection: weatherData.winddirection,
          windpower: weatherData.windpower,
          humidity: weatherData.humidity,
          reporttime: weatherData.reporttime
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<WeatherResponse>;
        if (axiosError.response?.data) {
          throw new Error(axiosError.response.data.info || '天气API请求失败');
        }
        throw new Error('网络请求失败，请检查网络连接');
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Get weather error:', error);
    res.status(500).json({
      code: 500,
      message: error.message || '获取天气数据失败'
    });
  }
} 