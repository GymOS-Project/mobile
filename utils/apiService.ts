import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getData } from "./localStorage";

const API_BASE_URL = "https://your-api-url.com";

const ACCESS_TOKEN_KEY = "access_token";

class ApiService {
  session: AxiosInstance;

  constructor() {
    this.session = axios.create({
      baseURL: API_BASE_URL,
    });

    this.session.interceptors.request.use(async (config: any) => {
      const token = await getData(ACCESS_TOKEN_KEY);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  get(url: string, params = {}) {
    return this.session.get(url, { params });
  }

  post(url: string, data = {}, config?: AxiosRequestConfig) {
    return this.session.post(url, data, config);
  }

  put(url: string, data = {}, config?: AxiosRequestConfig) {
    return this.session.put(url, data, config);
  }

  patch(url: string, data = {}, config?: AxiosRequestConfig) {
    return this.session.patch(url, data, config);
  }

  delete(url: string) {
    return this.session.delete(url);
  }
}

export default new ApiService();

export { ACCESS_TOKEN_KEY };
