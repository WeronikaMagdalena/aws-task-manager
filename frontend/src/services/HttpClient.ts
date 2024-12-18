import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { fetchAuthSession } from "aws-amplify/auth";

class HttpClient {
  private instance: AxiosInstance | null = null;

  private get http(): AxiosInstance {
    return this.instance != null ? this.instance : this.initHttp();
  }

  async getAuthToken(): Promise<string | undefined> {
    return (await fetchAuthSession()).tokens?.idToken?.toString();
  }

  initHttp() {
    const http = axios.create({
      baseURL: process.env.REACT_APP_API_GATEWAY_URL,
    });

    http.interceptors.request.use(
      async (config) => {
        let token = await this.getAuthToken();

        config.headers.Authorization = `Bearer ${token}`;

        return config;
      },
      (error) => Promise.reject(error),
    );

    this.instance = http;
    return http;
  }

  get<T = any, R = AxiosResponse<T>>(url: string): Promise<R> {
    return this.http.get<T, R>(url);
  }

  post<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.post<T, R>(url, data, config);
  }

  put<T = any, R = AxiosResponse<T>>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.put<T, R>(url, data, config);
  }

  delete<T = any, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<R> {
    return this.http.delete<T, R>(url, config);
  }
}

const httpClient = new HttpClient();

export default httpClient;
