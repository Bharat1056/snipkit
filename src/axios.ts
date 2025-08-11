/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import env from '@/lib/config/env';

// ---- Frontend routes that do NOT force auth redirect on 401/403 ----
const PUBLIC_FRONTEND_ROUTES = new Set<string>([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/about',
]);

export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  statusCode: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private instance: AxiosInstance;

  constructor(baseURL: string = env.NEXT_PUBLIC_API_URL ?? '') {
    this.instance = axios.create({
      baseURL,
      timeout: 70_000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      withCredentials: true,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request
    this.instance.interceptors.request.use(
      config => {
        if (env.NODE_ENV === 'development') {
          console.log(
            `🚀 API ${config.method?.toUpperCase()} ${config.baseURL ?? ''}${config.url}`,
            { params: config.params, data: config.data }
          );
        }
        // Always ensure cookies flow
        config.withCredentials = true;
        return config;
      },
      (error: AxiosError) => {
        if (env.NODE_ENV === 'development')
          console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        if (env.NODE_ENV === 'development') {
          console.log(
            `✅ API ${response.config.method?.toUpperCase()} ${response.config.url}`,
            { status: response.status, data: response.data }
          );
        }
        return response;
      },
      (error: AxiosError<ApiError>) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: AxiosError<ApiError>): void {
    const { response, request, message } = error;

    if (env.NODE_ENV === 'development') {
      console.error('❌ API Error:', {
        message,
        status: response?.status,
        data: response?.data,
        url: (request as any)?.responseURL,
      });
    }

    const status = response?.status ?? 0;

    if (status === 401 || status === 403) {
      this.handleAuthGuard();
      return;
    }
    if (status >= 500) {
      console.error('Server error occurred');
    }
  }

  // If current frontend route is NOT public → redirect to login
  private handleAuthGuard(): void {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname || '/';
    if (!PUBLIC_FRONTEND_ROUTES.has(currentPath)) {
      const next = currentPath + window.location.search;
      window.location.href = `/login?next=${encodeURIComponent(next)}`;
    }
  }

  // --------- HTTP Methods (keep your ApiResponse<T> shape) ---------
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.get<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.post<ApiResponse<T>>(url, data, config);
    return res.data.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.put<ApiResponse<T>>(url, data, config);
    return res.data.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const res = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return res.data.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.instance.delete<ApiResponse<T>>(url, config);
    return res.data.data;
  }

  async upload<T = any>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await this.instance.post<ApiResponse<T>>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: e => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
      withCredentials: true,
    });

    return res.data.data;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}


export const apiClient = new ApiClient();

export type { AxiosRequestConfig, AxiosResponse, AxiosError };
