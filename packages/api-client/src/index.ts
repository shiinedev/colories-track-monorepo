export const API_URL_LOCAL = "http://10.0.2.2:9000/api/v1";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";

export interface ApiResponse<T = unknown> {
  message: string;
  data?: T;
}

export class APiError extends Error {
  constructor(
    message: string,
    public status: number,
    public error: any,
  ) {
    super(message);
    this.name = "APiError";
  }
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL_LOCAL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  get: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .get<ApiResponse<T>>(endPoint, config)
      .then((res) => res.data.data as T),
  post: <T = unknown>(
    endPoint: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) =>
    axiosInstance
      .post<ApiResponse<T>>(endPoint, body, config)
      .then((res) => res.data.data as T),
  put: <T = unknown>(
    endPoint: string,
    body?: any,
    config?: AxiosRequestConfig,
  ) =>
    axiosInstance
      .put<ApiResponse<T>>(endPoint, body, config)
      .then((res) => res.data.data as T),
  delete: <T = unknown>(endPoint: string, config?: AxiosRequestConfig) =>
    axiosInstance
      .delete<ApiResponse<T>>(endPoint, config)
      .then((res) => res.data.data as T),
};
